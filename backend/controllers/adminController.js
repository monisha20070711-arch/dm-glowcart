const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/admin/analytics
const getDashboardAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'USER' });
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    const revenueResult = await Order.aggregate([
      { $match: { 'paymentDetails.status': 'Completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$grandTotal' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });

    // Low stock products (stock <= 5)
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).select('name stock price category SKU images');

    // Sales by Category
    const categoryStats = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.category',
          totalSales: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      }
    ]);

    // Order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    // Monthly revenue trend (recent orders)
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email');

    res.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue,
          pendingOrders,
          lowStockCount: lowStockProducts.length
        },
        lowStockProducts,
        categoryStats,
        orderStatusBreakdown,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const query = { role: 'USER' };

    if (search) {
      query.$or = [
        { name: new RegExp(search.trim(), 'i') },
        { email: new RegExp(search.trim(), 'i') }
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle User Active Status (Admin)
// @route   PUT /api/admin/users/:id/toggle-status
const toggleUserActiveStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'ADMIN') {
      return res.status(400).json({ success: false, message: 'Cannot deactivate Admin account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      data: { _id: user._id, isActive: user.isActive },
      message: `User ${user.name} has been ${user.isActive ? 'activated' : 'deactivated'}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardAnalytics,
  getUsers,
  toggleUserActiveStatus
};
