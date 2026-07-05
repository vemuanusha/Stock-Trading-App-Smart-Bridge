// Seeds the Stocks collection with a starter set of tickers.
// Run with: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Stock = require('../models/Stock');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Watchlist = require('../models/Watchlist');

const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: 195.5 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', price: 415.2 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', price: 172.8 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', price: 183.4 },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive', price: 248.9 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', price: 121.3 },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', price: 505.6 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials', price: 198.7 },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services', price: 645.1 },
  { symbol: 'DIS', name: 'The Walt Disney Company', sector: 'Communication Services', price: 112.4 },
  { symbol: 'KO', name: 'The Coca-Cola Company', sector: 'Consumer Staples', price: 63.2 },
  { symbol: 'BA', name: 'The Boeing Company', sector: 'Industrials', price: 178.9 },
];

const run = async () => {
  await connectDB();

  for (const s of stocks) {
    await Stock.findOneAndUpdate(
      { symbol: s.symbol },
      { ...s, previousClose: s.price, dayHigh: s.price, dayLow: s.price },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`Seeded ${stocks.length} stocks.`);

  // Create a default admin account if none exists yet
  const adminEmail = 'admin@stocksim.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    try {
      const admin = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
      });
      await Portfolio.create({ user: admin._id, holdings: [] });
      await Watchlist.create({ user: admin._id, stocks: [] });
      console.log('Created default admin -> email: admin@stocksim.com / password: admin123');
    } catch (err) {
      if (err.code === 11000) {
        console.error(
          '\nCould not create the admin user because of a duplicate key error on: ' +
          JSON.stringify(err.keyValue) +
          '\nThis usually means your MongoDB database already has a stale index from a ' +
          'different project (commonly a unique "username" index left over on a shared ' +
          '"test" database). This app never sets a DB_NAME env var by default other than ' +
          '"stock_sim", so if you still see this, either:\n' +
          '  1) Set DB_NAME=some_other_name in backend/.env, or\n' +
          '  2) In MongoDB Atlas / Compass, open the affected database\'s "users" collection ' +
          'and drop the offending index shown above, or drop the collection entirely if it ' +
          'is not needed.\n'
        );
      } else {
        throw err;
      }
    }
  } else {
    console.log('Default admin already exists.');
  }

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
