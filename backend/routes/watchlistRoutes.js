const express = require('express');
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require('../controllers/watchlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', getWatchlist);
router.post('/:stockId', addToWatchlist);
router.delete('/:stockId', removeFromWatchlist);

module.exports = router;
