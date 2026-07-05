const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    sector: { type: String, default: 'General' },
    price: { type: Number, required: true, min: 0 },
    previousClose: { type: Number, default: function () { return this.price; } },
    dayHigh: { type: Number },
    dayLow: { type: Number },
    volume: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

stockSchema.virtual('changePercent').get(function () {
  if (!this.previousClose) return 0;
  return ((this.price - this.previousClose) / this.previousClose) * 100;
});

stockSchema.set('toJSON', { virtuals: true });
stockSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Stock', stockSchema);
