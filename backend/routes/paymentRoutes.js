const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createUpiOrder,
  createCodOrder
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyRazorpayPayment);
router.post('/create-upi-order', protect, createUpiOrder);
router.post('/create-cod-order', protect, createCodOrder);

module.exports = router;
