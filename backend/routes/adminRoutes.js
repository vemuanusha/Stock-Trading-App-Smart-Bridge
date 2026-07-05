const express = require('express');
const { getUsers, updateUser, getStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/stats', getStats);

module.exports = router;
