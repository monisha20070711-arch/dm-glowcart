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

      // Create Initial Products
      await Product.insertMany([
        {
          name: 'Glow Perfect Primer',
          brand: 'DM-GLOWCART Beauty',
          category: 'Beauty & Personal Care',
          subcategory: 'Makeup',
          description: 'Silky smooth pore-blurring face primer.',
          price: 599,
          originalPrice: 799,
          stock: 25,
          SKU: 'DMG-BTY-001',
          images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'],
          rating: 4.8,
          reviewCount: 142,
          benefits: ['Blurs pores instantly'],
          featured: true,
          bestSeller: true
        },
        {
          name: 'Flawless Finish Foundation',
          brand: 'DM-GLOWCART Beauty',
          category: 'Beauty & Personal Care',
          subcategory: 'Makeup',
          description: 'Medium-to-full coverage liquid foundation SPF 20.',
          price: 899,
          originalPrice: 1199,
          stock: 30,
          SKU: 'DMG-BTY-002',
          images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'],
          rating: 4.7,
          reviewCount: 98,
          benefits: ['Natural satin finish'],
          featured: true,
          bestSeller: true
        },
        {
          name: 'HD Concealer',
          brand: 'DM-GLOWCART Beauty',
          category: 'Beauty & Personal Care',
          subcategory: 'Makeup',
          description: 'High-definition liquid concealer.',
          price: 499,
          originalPrice: 649,
          stock: 18,
          SKU: 'DMG-BTY-003',
          images: ['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800'],
          rating: 4.6,
          reviewCount: 85,
          benefits: ['Crease-proof'],
          bestSeller: true
        },
        {
          name: 'Velvet Matte Lipstick',
          brand: 'DM-GLOWCART Beauty',
          category: 'Beauty & Personal Care',
          subcategory: 'Makeup',
          description: 'Plush velvet matte bullet lipstick.',
          price: 499,
          originalPrice: 649,
          stock: 28,
          SKU: 'DMG-BTY-011',
          images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800'],
          rating: 4.9,
          reviewCount: 188,
          benefits: ['Shea Butter enriched'],
          featured: true,
          bestSeller: true
        },
        {
          name: 'Floral Print Cotton Anarkali Kurta',
          brand: 'GLOW FASHION',
          category: 'Fashion',
          subcategory: 'Ethnic Wear',
          description: 'Breathable cotton Anarkali kurta.',
          price: 1299,
          originalPrice: 1999,
          stock: 15,
          SKU: 'DMG-FSH-024',
          images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'],
          rating: 4.8,
          reviewCount: 88,
          benefits: ['100% Pure Cotton'],
          featured: true,
          bestSeller: true
        }
      ]);

      console.log('Auto-seeding completed successfully! Admin & Demo Users created.');
    }
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
