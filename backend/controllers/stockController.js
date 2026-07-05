const Stock = require('../models/Stock');

// @desc   Get all stocks (supports ?search=&sector=&sort=)
// @route  GET /api/stocks
// @access Public
const getStocks = async (req, res, next) => {
  try {
    const { search, sector, sort } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { symbol: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }
    if (sector) {
      query.sector = sector;
    }

    let cursor = Stock.find(query);

    if (sort === 'price_asc') cursor = cursor.sort({ price: 1 });
    else if (sort === 'price_desc') cursor = cursor.sort({ price: -1 });
    else cursor = cursor.sort({ symbol: 1 });

    const stocks = await cursor.exec();
    res.json(stocks);
  } catch (err) {
    next(err);
  }
};

// @desc   Get single stock by symbol or id
// @route  GET /api/stocks/:idOrSymbol
// @access Public
const getStock = async (req, res, next) => {
  try {
    const { idOrSymbol } = req.params;
    let stock = await Stock.findOne({ symbol: idOrSymbol.toUpperCase() });
    if (!stock) stock = await Stock.findById(idOrSymbol).catch(() => null);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json(stock);
  } catch (err) {
    next(err);
  }
};

// @desc   Create a stock (admin)
// @route  POST /api/stocks
// @access Private/Admin
const createStock = async (req, res, next) => {
  try {
    const { symbol, name, sector, price } = req.body;
    if (!symbol || !name || price === undefined) {
      return res.status(400).json({ message: 'symbol, name and price are required' });
    }
    const exists = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (exists) return res.status(400).json({ message: 'Stock symbol already exists' });

    const stock = await Stock.create({
      symbol: symbol.toUpperCase(),
      name,
      sector,
      price,
      previousClose: price,
      dayHigh: price,
      dayLow: price,
    });
    res.status(201).json(stock);
  } catch (err) {
    next(err);
  }
};

// @desc   Update a stock (admin) - e.g. update price, name, sector
// @route  PUT /api/stocks/:id
// @access Private/Admin
const updateStock = async (req, res, next) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    const { name, sector, price, isActive } = req.body;

    if (price !== undefined && price !== stock.price) {
      stock.previousClose = stock.price;
      stock.dayHigh = Math.max(stock.dayHigh || price, price);
      stock.dayLow = stock.dayLow ? Math.min(stock.dayLow, price) : price;
      stock.price = price;
    }
    if (name !== undefined) stock.name = name;
    if (sector !== undefined) stock.sector = sector;
    if (isActive !== undefined) stock.isActive = isActive;

    await stock.save();
    res.json(stock);
  } catch (err) {
    next(err);
  }
};

// @desc   Delete a stock (admin)
// @route  DELETE /api/stocks/:id
// @access Private/Admin
const deleteStock = async (req, res, next) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    await stock.deleteOne();
    res.json({ message: 'Stock removed' });
  } catch (err) {
    next(err);
  }
};

// @desc   Simulate a random price tick for all active stocks (admin utility)
// @route  POST /api/stocks/simulate-tick
// @access Private/Admin
const simulateTick = async (req, res, next) => {
  try {
    const stocks = await Stock.find({ isActive: true });
    const updates = await Promise.all(
      stocks.map(async (stock) => {
        const changePct = (Math.random() - 0.5) * 0.06; // +/- 3%
        const newPrice = Math.max(0.5, +(stock.price * (1 + changePct)).toFixed(2));
        stock.previousClose = stock.price;
        stock.dayHigh = Math.max(stock.dayHigh || newPrice, newPrice);
        stock.dayLow = stock.dayLow ? Math.min(stock.dayLow, newPrice) : newPrice;
        stock.price = newPrice;
        stock.volume += Math.floor(Math.random() * 1000);
        await stock.save();
        return stock;
      })
    );
    res.json(updates);
  } catch (err) {
    next(err);
  }
};

module.exports = { getStocks, getStock, createStock, updateStock, deleteStock, simulateTick };
