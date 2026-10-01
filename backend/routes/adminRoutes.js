const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getUsers,
  toggleUserActiveStatus
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/analytics', protect, adminOnly, getDashboardAnalytics);
router.get('/users', protect, adminOnly, getUsers);
router.put('/users/:id/toggle-status', protect, adminOnly, toggleUserActiveStatus);

module.exports = router;
