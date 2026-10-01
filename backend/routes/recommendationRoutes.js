const express = require('express');
const router = express.Router();
const { getGlowMatchRecommendations } = require('../controllers/recommendationController');

router.post('/glow-match', getGlowMatchRecommendations);

module.exports = router;
