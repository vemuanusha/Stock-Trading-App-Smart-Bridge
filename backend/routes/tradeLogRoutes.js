const express = require('express');
const { getTradeLogs, createTradeLog, deleteTradeLog } = require('../controllers/tradeLogController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', getTradeLogs);
router.post('/', createTradeLog);
router.delete('/:id', deleteTradeLog);

module.exports = router;
