const mongoose = require('mongoose');
const User = require('../models/User');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');

// @desc   Buy shares of a stock
// @route  POST /api/trade/buy
// @access Private
const buyStock = async (req, res, next) => {
  try {
    const { stockId, quantity } = req.body;
    const qty = Number(quantity);

    if (!stockId || !qty || qty <= 0) {
      return res.status(400).json({ message: 'stockId and a positive quantity are required' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock || !stock.isActive) {
      return res.status(404).json({ message: 'Stock not found or inactive' });
    }

    const cost = +(stock.price * qty).toFixed(2);
    const user = await User.findById(req.user._id);

    if (user.balance < cost) {
      return res.status(400).json({ message: 'Insufficient virtual balance for this trade' });
    }

    // Deduct balance
    user.balance = +(user.balance - cost).toFixed(2);
    await user.save();

    // Update portfolio holding (weighted average buy price)
    let portfolio = await Portfolio.findOne({ user: user._id });
    if (!portfolio) portfolio = await Portfolio.create({ user: user._id, holdings: [] });

    const holding = portfolio.holdings.find((h) => h.symbol === stock.symbol);
    if (holding) {
      const totalCost = holding.averageBuyPrice * holding.quantity + cost;
      holding.quantity += qty;
      holding.averageBuyPrice = +(totalCost / holding.quantity).toFixed(2);
    } else {
      portfolio.holdings.push({
        stock: stock._id,
        symbol: stock.symbol,
        quantity: qty,
        averageBuyPrice: stock.price,
      });
    }
    await portfolio.save();

    const transaction = await Transaction.create({
      user: user._id,
      stock: stock._id,
      symbol: stock.symbol,
      type: 'BUY',
      quantity: qty,
      price: stock.price,
      total: cost,
    });

    res.status(201).json({
      message: `Bought ${qty} share(s) of ${stock.symbol}`,
      balance: user.balance,
      transaction,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Sell shares of a stock
// @route  POST /api/trade/sell
// @access Private
const sellStock = async (req, res, next) => {
  try {
    const { stockId, quantity } = req.body;
    const qty = Number(quantity);

    if (!stockId || !qty || qty <= 0) {
      return res.status(400).json({ message: 'stockId and a positive quantity are required' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    const portfolio = await Portfolio.findOne({ user: req.user._id });
    const holding = portfolio && portfolio.holdings.find((h) => h.symbol === stock.symbol);

    if (!holding || holding.quantity < qty) {
      return res.status(400).json({ message: 'You do not own enough shares to sell' });
    }

    const proceeds = +(stock.price * qty).toFixed(2);

    holding.quantity -= qty;
    if (holding.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter((h) => h.symbol !== stock.symbol);
    }
    await portfolio.save();

    const user = await User.findById(req.user._id);
    user.balance = +(user.balance + proceeds).toFixed(2);
    await user.save();

    const transaction = await Transaction.create({
      user: user._id,
      stock: stock._id,
      symbol: stock.symbol,
      type: 'SELL',
      quantity: qty,
      price: stock.price,
      total: proceeds,
    });

    res.status(201).json({
      message: `Sold ${qty} share(s) of ${stock.symbol}`,
      balance: user.balance,
      transaction,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get logged-in user's transaction history
// @route  GET /api/trade/history
// @access Private
const getHistory = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .populate('stock', 'symbol name')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

module.exports = { buyStock, sellStock, getHistory };
