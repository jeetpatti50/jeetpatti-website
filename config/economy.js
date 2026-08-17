// Single source of truth for the chip economy.
// Rate: 1 chip = ₹1  (so ₹1 buys 1 chip, 1 chip sells for ₹1)
module.exports = {
  CHIP_RATE:      1,    // chips per ₹1
  SIGNUP_BONUS:   100,  // free chips granted on registration
  MIN_BUY_RUPEES: 10,   // minimum top-up amount (₹)
  MIN_SELL_CHIPS: 1000, // minimum withdrawal (₹1000 at 1:1)
  SEATS:          3,    // table seats — player funds all seats vs AI
};
