const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stock_sim';

    // Always connect to our own dedicated database, even if the connection
    // string doesn't specify one (e.g. a bare Atlas SRV string, which
    // otherwise defaults to a database called "test"). This avoids
    // collisions with unrelated collections/indexes from other projects
    // that might already exist on a shared cluster.
    const dbName = process.env.DB_NAME || 'stock_sim';

    const conn = await mongoose.connect(uri, { dbName });
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
