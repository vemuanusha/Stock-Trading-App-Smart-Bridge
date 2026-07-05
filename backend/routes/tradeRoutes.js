const express = require('express');
const { buyStock, sellStock, getHistory } = require('../controllers/tradeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.post('/buy', buyStock);
router.post('/sell', sellStock);
router.get('/history', getHistory);

module.exports = router;
