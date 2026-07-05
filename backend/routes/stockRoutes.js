const express = require('express');
const {
  getStocks,
  getStock,
  createStock,
  updateStock,
  deleteStock,
  simulateTick,
} = require('../controllers/stockController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getStocks);
router.post('/simulate-tick', protect, authorize('admin'), simulateTick);
router.get('/:idOrSymbol', getStock);
router.post('/', protect, authorize('admin'), createStock);
router.put('/:id', protect, authorize('admin'), updateStock);
router.delete('/:id', protect, authorize('admin'), deleteStock);

module.exports = router;
