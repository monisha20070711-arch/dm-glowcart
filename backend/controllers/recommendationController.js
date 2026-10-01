const Product = require('../models/Product');

// @desc    Smart "Glow Match" Recommendation Finder
// @route   POST /api/recommendations/glow-match
const getGlowMatchRecommendations = async (req, res) => {
  try {
    const { skinConcern, category, maxPrice, skinType, preference } = req.body;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (skinType && skinType !== 'All') {
      query.skinType = { $in: [skinType, 'All'] };
    }

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    let products = await Product.find(query);

    // Filter and score products by match suitability
    const scoredProducts = products.map((product) => {
      let score = 70; // Base score

      if (skinConcern && product.skinConcerns && product.skinConcerns.includes(skinConcern)) {
        score += 20;
      }

      if (preference) {
        const text = `${product.name} ${product.description} ${product.benefits.join(' ')}`.toLowerCase();
        if (text.includes(preference.toLowerCase())) {
          score += 10;
        }
      }

      if (product.rating >= 4.5) score += 5;
      if (product.bestSeller) score += 5;

      return {
        product,
        matchPercentage: Math.min(99, score),
        matchReason: `Ideal for ${skinConcern || 'daily skin care'} & matches your ₹${maxPrice || 1000} budget limit.`
      };
    });

    // Sort by highest match percentage
    scoredProducts.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({
      success: true,
      count: scoredProducts.length,
      data: scoredProducts.slice(0, 8)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGlowMatchRecommendations
};
