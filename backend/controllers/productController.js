const Product = require('../models/Product');

// @desc    Get all products with filtering, searching, sorting & pagination
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const queryObj = {};

    // Search query (case-insensitive across name, brand, category, description)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      queryObj.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { description: searchRegex }
      ];
    }

    // Category Filter (Case-insensitive matching)
    if (req.query.category && req.query.category !== 'All') {
      const catClean = req.query.category.trim();
      queryObj.category = new RegExp(`^${catClean}$`, 'i');
    }

    // Brand Filter (Case-insensitive matching)
    if (req.query.brand) {
      queryObj.brand = new RegExp(req.query.brand.trim(), 'i');
    }

    // Stock Filter
    if (req.query.inStock === 'true') {
      queryObj.stock = { $gt: 0 };
    }

    // Price Range Filter (Safeguarded against minPrice > maxPrice conflicts)
    if (req.query.minPrice || req.query.maxPrice) {
      const minP = req.query.minPrice && !isNaN(req.query.minPrice) ? Number(req.query.minPrice) : null;
      const maxP = req.query.maxPrice && !isNaN(req.query.maxPrice) ? Number(req.query.maxPrice) : null;

      queryObj.price = {};
      if (minP !== null && (maxP === null || minP <= maxP)) {
        queryObj.price.$gte = minP;
      }
      if (maxP !== null) {
        queryObj.price.$lte = maxP;
      }
    }

    // Rating Filter
    if (req.query.rating) {
      queryObj.rating = { $gte: Number(req.query.rating) };
    }

    // Badges Filters
    if (req.query.featured === 'true') queryObj.featured = true;
    if (req.query.bestSeller === 'true') queryObj.bestSeller = true;
    if (req.query.newArrival === 'true') queryObj.newArrival = true;

    // Sorting
    let sortOption = {};
    switch (req.query.sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
      default:
        sortOption = { reviewCount: -1, rating: -1 };
        break;
    }

    const totalProducts = await Product.countDocuments(queryObj);
    const products = await Product.find(queryObj).sort(sortOption).skip(skip).limit(limit);

    res.json({
      success: true,
      count: products.length,
      total: totalProducts,
      pages: Math.ceil(totalProducts / limit),
      page,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product (Admin)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      subcategory,
      description,
      price,
      originalPrice,
      stock,
      images,
      benefits,
      ingredients,
      howToUse,
      featured,
      bestSeller,
      newArrival,
      skinConcerns,
      skinType
    } = req.body;

    const sku = `DMG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const product = new Product({
      name,
      brand: brand || 'DM-GLOWCART',
      category,
      subcategory: subcategory || 'General',
      description,
      price,
      originalPrice: originalPrice || price,
      stock: stock !== undefined ? stock : 10,
      SKU: sku,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'],
      benefits: benefits || [],
      ingredients: ingredients || 'Cruelty-free, Dermatologically Tested',
      howToUse: howToUse || 'Apply as directed.',
      featured: featured || false,
      bestSeller: bestSeller || false,
      newArrival: newArrival || false,
      skinConcerns: skinConcerns || [],
      skinType: skinType || 'All'
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, data: createdProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json({ success: true, data: updatedProduct });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ success: true, message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all distinct brands & categories for filters
// @route   GET /api/products/meta/filters
const getProductFiltersMeta = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    const brands = await Product.distinct('brand');
    res.json({ success: true, data: { categories, brands } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductFiltersMeta
};
