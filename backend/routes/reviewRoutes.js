const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  addProductReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, addProductReview);

module.exports = router;
