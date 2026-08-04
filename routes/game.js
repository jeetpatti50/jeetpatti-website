const express     = require('express');
const router      = express.Router();
const User        = require('../models/User');
const GameHistory = require('../models/GameHistory');
const Transaction = require('../models/Transaction');
const auth        = require('../middleware/auth');

router.post('/start', auth, async (req, res) => {
  try {
    const { bet } = req.body;
    if (!bet || bet < 1)
      return res.status(400).json({ error: 'Invalid bet amount' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const totalCost = bet * 3;
    if (user.chips < totalCost)
      return res.status(400).json({ error: 'Not enough chips. Buy more chips to play.' });
    await User.findByIdAndUpdate(req.user.id, { $inc: { chips: -totalCost } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/end', auth, async (req, res) => {
  try {
    const { result, chipsWon, chipsLost, pot, playerCards, aiCards } = req.body;
    let newChips = 0;
    if (result === 'win') {
      const user = await User.findByIdAndUpdate(
        req.user.id, { $inc: { chips: pot } }, { new: true }
      );
      newChips = user.chips;
      await Transaction.create({
        userId: req.user.id, type: 'game_win', chips: pot, amount: 0, status: 'success'
      });
    } else {
      const user = await User.findById(req.user.id);
      newChips = user.chips;
      await Transaction.create({
        userId: req.user.id, type: 'game_loss', chips: -(chipsLost || 0), amount: 0, status: 'success'
      });
    }
    await GameHistory.create({
      userId: req.user.id, result,
      chipsWon:    result === 'win' ? (pot || 0) : 0,
      chipsLost:   result === 'loss' ? (chipsLost || 0) : 0,
      betAmount:   chipsLost || 0,
      pot:         pot || 0,
      playerCards: playerCards || [],
      aiCards:     aiCards || []
    });
    res.json({ success: true, newChips });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const history = await GameHistory.find({ userId: req.user.id })
      .sort({ createdAt: -1 }).limit(30);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;