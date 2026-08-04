const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  result:      { type: String, enum: ['win', 'loss'] },
  chipsWon:    { type: Number, default: 0 },
  chipsLost:   { type: Number, default: 0 },
  betAmount:   { type: Number },
  pot:         { type: Number, default: 0 },
  playerCards: [String],
  aiCards:     [String],
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('GameHistory', gameSchema);