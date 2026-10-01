const Coupon = require('../models/Coupon');

// @desc    Validate a coupon code & return discount
// @route   POST /api/coupons/validate
const validateCoupon = async (req, res) => {
  try {
    const { code, cartAmount } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
    }

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), active: true });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ success: false, message: 'Coupon code has expired' });
    }

    if (coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }

    if (cartAmount < coupon.minimumOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minimumOrder} required for coupon ${coupon.code}`
      });
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (cartAmount * coupon.discountValue) / 100;
      if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
        discount = coupon.maximumDiscount;
      }
    } else if (coupon.discountType === 'FIXED') {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, cartAmount);

    res.json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discount),
        minimumOrder: coupon.minimumOrder
      },
      message: `Coupon ${coupon.code} applied successfully!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new coupon (Admin)
// @route   POST /api/coupons
const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minimumOrder, maximumDiscount, usageLimit, expiryDate, active } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType: discountType || 'PERCENTAGE',
      discountValue,
      minimumOrder: minimumOrder || 0,
      maximumDiscount: maximumDiscount || 500,
      usageLimit: usageLimit || 100,
      expiryDate: expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      active: active !== undefined ? active : true
    });

    res.status(201).json({ success: true, data: coupon, message: 'Coupon created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update coupon (Admin)
// @route   PUT /api/coupons/:id
const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      if (req.body.code) req.body.code = req.body.code.toUpperCase();
      Object.assign(coupon, req.body);
      const updated = await coupon.save();
      res.json({ success: true, data: updated, message: 'Coupon updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      await coupon.deleteOne();
      res.json({ success: true, message: 'Coupon deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
};
