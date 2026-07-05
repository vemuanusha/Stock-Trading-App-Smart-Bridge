const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

// @desc   Get logged-in user's portfolio with live valuation
// @route  GET /api/portfolio
// @access Private
const getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) return res.json({ holdings: [], totalValue: 0, totalInvested: 0, totalPL: 0 });

    const symbols = portfolio.holdings.map((h) => h.symbol);
    const stocks = await Stock.find({ symbol: { $in: symbols } });
    const priceMap = Object.fromEntries(stocks.map((s) => [s.symbol, s.price]));

    let totalValue = 0;
    let totalInvested = 0;

    const holdings = portfolio.holdings.map((h) => {
      const currentPrice = priceMap[h.symbol] ?? h.averageBuyPrice;
      const marketValue = +(currentPrice * h.quantity).toFixed(2);
      const investedValue = +(h.averageBuyPrice * h.quantity).toFixed(2);
      const profitLoss = +(marketValue - investedValue).toFixed(2);
      const profitLossPercent = investedValue ? +((profitLoss / investedValue) * 100).toFixed(2) : 0;

      totalValue += marketValue;
      totalInvested += investedValue;

      return {
        symbol: h.symbol,
        quantity: h.quantity,
        averageBuyPrice: h.averageBuyPrice,
        currentPrice,
        marketValue,
        investedValue,
        profitLoss,
        profitLossPercent,
      };
    });

    res.json({
      holdings,
      totalValue: +totalValue.toFixed(2),
      totalInvested: +totalInvested.toFixed(2),
      totalPL: +(totalValue - totalInvested).toFixed(2),
      balance: req.user.balance,
      netWorth: +(totalValue + req.user.balance).toFixed(2),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPortfolio };
