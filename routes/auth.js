const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const auth    = require('../middleware/auth');
const { sendOtp, verifyOtp, consumeVerified } = require('../services/otp');
const { SIGNUP_BONUS } = require('../config/economy');

// Step 1 of registration: send an OTP to the phone number.
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!/^\d{10}$/.test(phone || ''))
      return res.status(400).json({ error: 'Enter a valid 10-digit mobile number' });
    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ error: 'Mobile number already registered' });
    await sendOtp(phone);
    res.json({ success: true });
  } catch (err) {
    if (err.code === 'COOLDOWN') return res.status(429).json({ error: err.message });
    console.error('send-otp:', err.message);
    res.status(500).json({ error: err.message || 'Could not send OTP' });
  }
});

// Step 2 of registration: confirm the OTP. On success the number is marked
// verified for a short window so /register can complete without re-entering it.
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!/^\d{10}$/.test(phone || ''))
      return res.status(400).json({ error: 'Enter a valid 10-digit mobile number' });
    if (!otp) return res.status(400).json({ error: 'Enter the OTP' });
    const ok = await verifyOtp(phone, String(otp).trim());
    if (!ok) return res.status(400).json({ error: 'Invalid or incorrect OTP' });
    res.json({ success: true });
  } catch (err) {
    if (err.code === 'NO_SESSION' || err.code === 'EXPIRED')
      return res.status(400).json({ error: err.message });
    console.error('verify-otp:', err.message);
    res.status(500).json({ error: 'Could not verify OTP' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const email = (req.body.email || '').trim().toLowerCase(); // optional
    if (!name || !phone || !password)
      return res.status(400).json({ error: 'Name, mobile and password are required' });
    if (!/^\d{10}$/.test(phone))
      return res.status(400).json({ error: 'Enter a valid 10-digit mobile number' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ error: 'Enter a valid email address' });

    // The phone must have passed /verify-otp in the last few minutes.
    if (!consumeVerified(phone))
      return res.status(400).json({ error: 'Please verify your mobile number first' });

    if (email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ error: 'Email already registered' });
    }
    const phoneTaken = await User.findOne({ phone });
    if (phoneTaken) return res.status(400).json({ error: 'Mobile number already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const doc = { name, phone, password: hashed, chips: SIGNUP_BONUS, phoneVerified: true };
    if (email) doc.email = email;
    const user  = await User.create(doc);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email: user.email || '', chips: user.chips } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, phone, identifier, password } = req.body;
    // Accept email or phone. `identifier` is the new single field; email/phone
    // kept for backward compatibility.
    const id = (identifier || email || phone || '').trim();
    if (!id || !password)
      return res.status(400).json({ error: 'Email/mobile and password required' });
    const query = /^\d{10}$/.test(id) ? { phone: id } : { email: id.toLowerCase() };
    const user = await User.findOne(query);
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (user.isBlocked) return res.status(403).json({ error: 'Account blocked. Contact support.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Wrong password' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email: user.email, chips: user.chips } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/update-bank', auth, async (req, res) => {
  try {
    const { bankAccount, ifscCode, accountName } = req.body;
    await User.findByIdAndUpdate(req.user.id, { bankAccount, ifscCode, accountName });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;