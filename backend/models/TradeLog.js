const mongoose = require('mongoose');

// A personal trade journal entry. Unlike the Transaction model (created
// automatically by /api/trade/buy and /api/trade/sell), a TradeLog entry is
// added and removed manually by the user for record-keeping only — it never
// touches the user's balance or Portfolio holdings.
const tradeLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    type: { type: String, enum: ['BUY', 'SELL'], required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    tradeDate: { type: Date, default: Date.now },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

tradeLogSchema.virtual('total').get(function () {
  return +(this.quantity * this.price).toFixed(2);
});
tradeLogSchema.set('toJSON', { virtuals: true });
tradeLogSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TradeLog', tradeLogSchema);
