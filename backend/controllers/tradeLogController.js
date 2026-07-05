const TradeLog = require('../models/TradeLog');

// @desc   Get the logged-in user's trade log entries
// @route  GET /api/tradelog
// @access Private
const getTradeLogs = async (req, res, next) => {
  try {
    const entries = await TradeLog.find({ user: req.user._id }).sort({ tradeDate: -1, createdAt: -1 });
    res.json(entries);
  } catch (err) {
    next(err);
  }
};

// @desc   Add a manual trade log entry (record-keeping only — does not
//         touch balance or portfolio holdings)
// @route  POST /api/tradelog
// @access Private
const createTradeLog = async (req, res, next) => {
  try {
    const { symbol, type, quantity, price, tradeDate, notes } = req.body;

    if (!symbol || !type || !quantity || price === undefined) {
      return res.status(400).json({ message: 'symbol, type, quantity and price are required' });
    }
    if (!['BUY', 'SELL'].includes(type)) {
      return res.status(400).json({ message: 'type must be BUY or SELL' });
    }
    if (Number(quantity) <= 0 || Number(price) < 0) {
      return res.status(400).json({ message: 'quantity must be positive and price cannot be negative' });
    }

    const entry = await TradeLog.create({
      user: req.user._id,
      symbol: symbol.toUpperCase(),
      type,
      quantity: Number(quantity),
      price: Number(price),
      tradeDate: tradeDate ? new Date(tradeDate) : new Date(),
      notes,
    });

    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};

// @desc   Delete a trade log entry (only the owner may delete it)
// @route  DELETE /api/tradelog/:id
// @access Private
const deleteTradeLog = async (req, res, next) => {
  try {
    const entry = await TradeLog.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Trade log entry not found' });

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own trade log entries' });
    }

    await entry.deleteOne();
    res.json({ message: 'Trade log entry deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTradeLogs, createTradeLog, deleteTradeLog };
