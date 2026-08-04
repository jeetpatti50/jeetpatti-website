const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  phone:        { type: String, required: true },
  password:     { type: String, required: true },
  chips:        { type: Number, default: 100 },
  totalBought:  { type: Number, default: 0 },
  totalSold:    { type: Number, default: 0 },
  isAdmin:      { type: Boolean, default: false },
  isBlocked:    { type: Boolean, default: false },
  kycVerified:  { type: Boolean, default: false },
  bankAccount:  { type: String, default: '' },
  ifscCode:     { type: String, default: '' },
  accountName:  { type: String, default: '' },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);