const mongoose = require('mongoose');
const { SIGNUP_BONUS } = require('../config/economy');

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, unique: true, sparse: true, lowercase: true, trim: true }, // optional

  phone:        { type: String, required: true },
  phoneVerified:{ type: Boolean, default: false },
  password:     { type: String, required: true },
  chips:        { type: Number, default: SIGNUP_BONUS },
  totalBought:  { type: Number, default: 0 },
  totalSold:    { type: Number, default: 0 },
  activeBet:    { type: Number, default: 0 }, // per-hand stake, set on game start, cleared on end
  isAdmin:      { type: Boolean, default: false },
  isBlocked:    { type: Boolean, default: false },
  kycVerified:  { type: Boolean, default: false },
  bankAccount:  { type: String, default: '' },
  ifscCode:     { type: String, default: '' },
  accountName:  { type: String, default: '' },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);