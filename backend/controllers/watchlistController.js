const Watchlist = require('../models/Watchlist');
const Stock = require('../models/Stock');

// @desc   Get logged-in user's watchlist
// @route  GET /api/watchlist
// @access Private
const getWatchlist = async (req, res, next) => {
  try {
    let watchlist = await Watchlist.findOne({ user: req.user._id }).populate('stocks');
    if (!watchlist) watchlist = await Watchlist.create({ user: req.user._id, stocks: [] });
    res.json(watchlist.stocks);
  } catch (err) {
    next(err);
  }
};

// @desc   Add a stock to watchlist
// @route  POST /api/watchlist/:stockId
// @access Private
const addToWatchlist = async (req, res, next) => {
  try {
    const stock = await Stock.findById(req.params.stockId);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    let watchlist = await Watchlist.findOne({ user: req.user._id });
    if (!watchlist) watchlist = await Watchlist.create({ user: req.user._id, stocks: [] });

    if (!watchlist.stocks.some((id) => id.toString() === stock._id.toString())) {
      watchlist.stocks.push(stock._id);
      await watchlist.save();
    }

    const populated = await watchlist.populate('stocks');
    res.json(populated.stocks);
  } catch (err) {
    next(err);
  }
};

// @desc   Remove a stock from watchlist
// @route  DELETE /api/watchlist/:stockId
// @access Private
const removeFromWatchlist = async (req, res, next) => {
  try {
    const watchlist = await Watchlist.findOne({ user: req.user._id });
    if (!watchlist) return res.json([]);

    watchlist.stocks = watchlist.stocks.filter(
      (id) => id.toString() !== req.params.stockId
    );
    await watchlist.save();

    const populated = await watchlist.populate('stocks');
    res.json(populated.stocks);
  } catch (err) {
    next(err);
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
