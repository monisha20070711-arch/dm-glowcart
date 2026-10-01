const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      default: 'DM-GLOWCART'
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    subcategory: {
      type: String,
      trim: true,
      default: 'General'
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    originalPrice: {
      type: Number,
      required: [true, 'Original price is required'],
      min: [0, 'Original price cannot be negative']
    },
    discount: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      default: 10,
      min: [0, 'Stock cannot be negative']
    },
    SKU: {
      type: String,
      unique: true,
      required: true
    },
    images: [
      {
        type: String,
        required: true
      }
    ],
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    benefits: [String],
    ingredients: {
      type: String,
      default: 'Cruelty-free, Dermatologically Tested, Premium Quality Ingredients.'
    },
    howToUse: {
      type: String,
      default: 'Apply evenly on clean skin or as directed for best results.'
    },
    specifications: {
      type: Map,
      of: String,
      default: {}
    },
    featured: {
      type: Boolean,
      default: false
    },
    bestSeller: {
      type: Boolean,
      default: false
    },
    newArrival: {
      type: Boolean,
      default: false
    },
    skinConcerns: [
      {
        type: String,
        trim: true
      }
    ],
    skinType: {
      type: String,
      enum: ['All', 'Dry', 'Oily', 'Combination', 'Sensitive', 'Normal'],
      default: 'All'
    }
  },
  { timestamps: true }
);

// Calculate discount automatically before save
productSchema.pre('save', function (next) {
  if (this.originalPrice > this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  } else {
    this.discount = 0;
  }
  next();
});

productSchema.index({ name: 'text', brand: 'text', category: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
