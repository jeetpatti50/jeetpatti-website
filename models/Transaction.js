const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type:        { type: String, enum: ['buy', 'sell', 'game_win', 'game_loss'] },
  chips:       { type: Number },
  amount:      { type: Number, default: 0 },
  paymentId:   { type: String, default: '' },
  bankAccount: { type: String, default: '' },
  ifscCode:    { type: String, default: '' },
  accountName: { type: String, default: '' },
  status:      { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);