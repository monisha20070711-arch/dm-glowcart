const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Coupon = require('./models/Coupon');
const { productsData } = require('./seed');

// Load environment variables
dotenv.config();

// Auto-seed helper if database is fresh/empty
const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments({});
    if (userCount === 0) {
      console.log('Database is empty. Running automatic database seed...');
      
      // Create Admin
      await User.create({
        name: 'DM-GLOWCART Admin',
        email: 'admin@glowcart.com',
        password: 'Admin@123',
        role: 'ADMIN',
        phone: '+91 9876543210',
        isActive: true
      });

      // Create Demo User
      await User.create({
        name: 'Monisha User',
        email: 'user@glowcart.com',
        password: 'User@123',
        role: 'USER',
        phone: '+91 9876543211',
        isActive: true
      });

      // Create Coupons
      await Coupon.insertMany([
        { code: 'GLOW10', discountType: 'PERCENTAGE', discountValue: 10, minimumOrder: 300, maximumDiscount: 200, usageLimit: 500, expiryDate: new Date('2027-12-31') },
        { code: 'WELCOME15', discountType: 'PERCENTAGE', discountValue: 15, minimumOrder: 500, maximumDiscount: 350, usageLimit: 300, expiryDate: new Date('2027-12-31') },
        { code: 'BEAUTY20', discountType: 'PERCENTAGE', discountValue: 20, minimumOrder: 999, maximumDiscount: 500, usageLimit: 200, expiryDate: new Date('2027-12-31') }
      ]);

      // Create Categories
      await Category.insertMany([
        { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', description: 'Cosmetics & skincare', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800' },
        { name: 'Fashion', slug: 'fashion', description: 'Apparel & ethnic wear', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800' },
        { name: 'Accessories', slug: 'accessories', description: 'Bags & jewelry', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800' },
        { name: 'Home & Lifestyle', slug: 'home-lifestyle', description: 'Candles & decor', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800' }
      ]);
    }

    // Ensure all products (including 5 budget items under ₹20) are force-upserted in MongoDB
    if (productsData && productsData.length > 0) {
      for (const item of productsData) {
        await Product.findOneAndUpdate(
          { SKU: item.SKU },
          { $set: item },
          { upsert: true, new: true }
        );
      }
    }

    console.log('Auto-seed check completed! All products & budget items verified.');
  } catch (err) {
    console.error('Auto-seed check error:', err.message);
  }
};

// Connect Database
connectDB().then(() => {
  autoSeedIfEmpty();
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Serve Frontend Static Assets when in Production or Replit/Render
const frontendDistPath = path.join(__dirname, '../frontend/dist');
const fs = require('fs');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => {
    if (!req.originalUrl.startsWith('/api')) {
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    }
  });
} else {
  // Root Health Check endpoint for development mode
  app.get('/', (req, res) => {
    res.json({
      message: 'DM-GLOWCART Full-Stack Beauty & Lifestyle API Server',
      tagline: 'Everyday Essentials, Made Better',
      status: 'Running',
      version: '1.0.0',
      supportEmail: 'monisha20070711@gmail.com',
      location: 'Tiruppur, Tamil Nadu, India'
    });
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DM-GLOWCART Backend server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
