const express     = require('express');
const router      = express.Router();
const User        = require('../models/User');
const Transaction = require('../models/Transaction');

const ADMIN_PASSWORD = 'JeetPatti@Admin2025';

function adminAuth(req, res, next) {
  if (req.headers['authorization'] === ADMIN_PASSWORD) return next();
  res.status(401).json({ error: 'Wrong admin password' });
}

router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const withdrawals = await Transaction.find({ type: 'sell', status: 'pending' })
      .populate('userId', 'name email phone bankAccount ifscCode accountName')
      .sort({ createdAt: -1 });
    const recentTransactions = await Transaction.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 }).limit(50);
    const today = new Date(); today.setHours(0,0,0,0);
    const todayBuys = await Transaction.find({ type: 'buy', status: 'success', createdAt: { $gte: today } });
    const todayRevenue = todayBuys.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalTransactions = await Transaction.countDocuments();
    res.json({ users, withdrawals, recentTransactions, totalUsers: users.length, todayRevenue, pendingWithdrawals: withdrawals.length, totalTransactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/block/:id', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: true });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/unblock/:id', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: false });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/approve/:id', adminAuth, async (req, res) => {
  try {
    await Transaction.findByIdAndUpdate(req.params.id, { status: 'success' });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/reject/:id', adminAuth, async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id);
    if (!txn) return res.status(404).json({ error: 'Not found' });
    await User.findByIdAndUpdate(txn.userId, { $inc: { chips: Math.abs(txn.chips) } });
    await Transaction.findByIdAndUpdate(req.params.id, { status: 'failed' });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;