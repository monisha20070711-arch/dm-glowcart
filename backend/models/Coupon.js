const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    discountType: {
      type: String,
      enum: ['PERCENTAGE', 'FIXED'],
      required: true,
      default: 'PERCENTAGE'
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0
    },
    minimumOrder: {
      type: Number,
      default: 0
    },
    maximumDiscount: {
      type: Number,
      default: 500
    },
    usageLimit: {
      type: Number,
      default: 100
    },
    timesUsed: {
      type: Number,
      default: 0
    },
    expiryDate: {
      type: Date,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
