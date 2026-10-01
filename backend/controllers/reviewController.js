const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });

    const stats = {
      avgRating: 0,
      totalReviews: reviews.length,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };

    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => {
        stats.distribution[r.rating] = (stats.distribution[r.rating] || 0) + 1;
        return acc + r.rating;
      }, 0);
      stats.avgRating = parseFloat((sum / reviews.length).toFixed(1));
    }

    res.json({ success: true, data: { reviews, stats } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review for a product
// @route   POST /api/reviews/product/:productId
const addProductReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ product: productId, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      title: title || 'Verified Purchase Review',
      comment,
      verifiedPurchase: true
    });

    // Update product rating and review count
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    product.rating = parseFloat(avgRating.toFixed(1));
    product.reviewCount = allReviews.length;
    await product.save();

    res.status(201).json({ success: true, data: review, message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProductReviews,
  addProductReview
};
