const express     = require('express');
const router      = express.Router();
const Razorpay    = require('razorpay');
const User        = require('../models/User');
const Transaction = require('../models/Transaction');
const auth        = require('../middleware/auth');
const { CHIP_RATE, MIN_BUY_RUPEES, MIN_SELL_CHIPS } = require('../config/economy');

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/buy', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount < MIN_BUY_RUPEES)
      return res.status(400).json({ error: 'Minimum amount is Rs ' + MIN_BUY_RUPEES });
    const chips = amount * CHIP_RATE;
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: 'order_' + Date.now()
    });
    await Transaction.create({
      userId: req.user.id, type: 'buy',
      chips, amount, paymentId: order.id, status: 'pending'
    });
    res.json({ order: { ...order, key_id: process.env.RAZORPAY_KEY_ID }, chips });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create order' });
  }
});

router.post('/confirm', auth, async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;
    const txn = await Transaction.findOne({ paymentId: orderId });
    if (!txn) return res.status(404).json({ error: 'Transaction not found' });
    txn.paymentId = paymentId;
    txn.status    = 'success';
    await txn.save();
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { chips: txn.chips, totalBought: txn.chips } },
      { new: true }
    );
    res.json({ success: true, chips: txn.chips, newChips: user.chips });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/sell', auth, async (req, res) => {
  try {
    const { chips, bankAccount, ifscCode, accountName } = req.body;
    if (!chips || chips < MIN_SELL_CHIPS)
      return res.status(400).json({ error: 'Minimum ' + MIN_SELL_CHIPS + ' chips required' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.chips < chips)
      return res.status(400).json({ error: 'Not enough chips' });
    if (!bankAccount || !ifscCode || !accountName)
      return res.status(400).json({ error: 'Bank details required' });
    const amount = Math.floor(chips / CHIP_RATE);
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { chips: -chips, totalSold: chips },
      $set: { bankAccount, ifscCode, accountName }
    });
    await Transaction.create({
      userId: req.user.id, type: 'sell',
      chips: -chips, amount, bankAccount, ifscCode, accountName, status: 'pending'
    });
    res.json({ success: true, message: 'Withdrawal of Rs ' + amount + ' submitted. Will process within 24 hours.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/my-transactions', auth, async (req, res) => {
  try {
    const txns = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json(txns);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;