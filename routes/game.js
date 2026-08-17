const express     = require('express');
const router      = express.Router();
const User        = require('../models/User');
const GameHistory = require('../models/GameHistory');
const Transaction = require('../models/Transaction');
const auth        = require('../middleware/auth');
const { SEATS }   = require('../config/economy');

router.post('/start', auth, async (req, res) => {
  try {
    const bet = Number(req.body.bet);
    if (!Number.isFinite(bet) || bet < 1)
      return res.status(400).json({ error: 'Invalid bet amount' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const totalCost = bet * SEATS;
    if (user.chips < totalCost)
      return res.status(400).json({ error: 'Not enough chips. Buy more chips to play.' });
    // Deduct the stake and record the active bet so /end can't be spoofed.
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { chips: -totalCost }, $set: { activeBet: bet }
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/end', auth, async (req, res) => {
  try {
    const { result, playerCards, aiCards } = req.body;
    if (result !== 'win' && result !== 'loss')
      return res.status(400).json({ error: 'Invalid result' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Payout is computed from the server-recorded bet, NOT from client input.
    const bet = user.activeBet || 0;
    if (bet <= 0)
      return res.status(400).json({ error: 'No active game' });
    const pot = bet * SEATS;

    let newChips = user.chips;
    if (result === 'win') {
      const updated = await User.findByIdAndUpdate(
        req.user.id, { $inc: { chips: pot }, $set: { activeBet: 0 } }, { new: true }
      );
      newChips = updated.chips;
      await Transaction.create({
        userId: req.user.id, type: 'game_win', chips: pot, amount: 0, status: 'success'
      });
    } else {
      await User.findByIdAndUpdate(req.user.id, { $set: { activeBet: 0 } });
      await Transaction.create({
        userId: req.user.id, type: 'game_loss', chips: -pot, amount: 0, status: 'success'
      });
    }
    await GameHistory.create({
      userId: req.user.id, result,
      chipsWon:    result === 'win' ? pot : 0,
      chipsLost:   result === 'loss' ? pot : 0,
      betAmount:   bet,
      pot:         pot,
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