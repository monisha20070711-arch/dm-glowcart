const express = require('express');
const router = express.Router();
const { submitContactForm, getContactSubmissions } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', submitContactForm);
router.get('/', protect, adminOnly, getContactSubmissions);

module.exports = router;
