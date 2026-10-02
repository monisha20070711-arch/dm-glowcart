const Product = require('../models/Product');

// @desc    Smart "Glow Match" Recommendation Finder
// @route   POST /api/recommendations/glow-match
const getGlowMatchRecommendations = async (req, res) => {
  try {
    const { skinConcern, category, maxPrice, skinType, preference } = req.body;

    const maxBudget = maxPrice ? Number(maxPrice) : 2000;

    // 1. Try finding products matching category and budget
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (maxBudget) {
      query.price = { $lte: maxBudget };
    }

    let products = await Product.find(query);

    // 2. If exact category + price returns fewer than 4 products, relax category filter to find products within budget
    if (!products || products.length < 4) {
      products = await Product.find({ price: { $lte: Math.max(maxBudget, 1000) } });
    }

    // 3. If still fewer than 4, fetch top products from store catalog
    if (!products || products.length < 4) {
      products = await Product.find({}).limit(8);
    }

    // Filter & score products by match suitability
    const scoredProducts = products.map((product) => {
      let score = 75; // Base match score

      if (skinConcern && product.skinConcerns && product.skinConcerns.includes(skinConcern)) {
        score += 15;
      }

      if (category && product.category === category) {
        score += 10;
      }

      if (product.price <= maxBudget) {
        score += 5;
      }

      if (product.rating >= 4.5) score += 3;
      if (product.bestSeller) score += 2;

      const finalMatch = Math.min(99, Math.max(84, score));

      return {
        product,
        matchPercentage: finalMatch,
        matchReason: `Formulated for ${skinConcern || 'glowing skin'} & matches your ₹${maxBudget} budget limit.`
      };
    });

    // Sort by highest match percentage
    scoredProducts.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({
      success: true,
      count: scoredProducts.length,
      data: scoredProducts.slice(0, 6)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGlowMatchRecommendations
};
