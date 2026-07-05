const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Stock = require('../models/Stock');

// @desc   Get all users (admin)
// @route  GET /api/admin/users
// @access Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// @desc   Update a user's role or active balance (admin)
// @route  PUT /api/admin/users/:id
// @access Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { role, balance } = req.body;
    if (role !== undefined) user.role = role;
    if (balance !== undefined) user.balance = balance;

    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role, balance: user.balance });
  } catch (err) {
    next(err);
  }
};

// @desc   Get platform-wide stats (admin dashboard)
// @route  GET /api/admin/stats
// @access Private/Admin
const getStats = async (req, res, next) => {
  try {
    const [userCount, stockCount, txnCount, txns] = await Promise.all([
      User.countDocuments(),
      Stock.countDocuments({ isActive: true }),
      Transaction.countDocuments(),
      Transaction.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email'),
    ]);

    res.json({
      userCount,
      stockCount,
      transactionCount: txnCount,
      recentTransactions: txns,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, updateUser, getStats };
