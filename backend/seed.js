const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');
const Category = require('./models/Category');

dotenv.config();

const productsData = [
  // --- 5 SPECIAL BUDGET PRODUCTS UNDER ₹20 ---
  {
    name: 'Hydrating Hyaluronic Sheet Mask',
    brand: 'DM-GLOWCART Beauty',
    category: 'Beauty & Personal Care',
    subcategory: 'Skincare',
    description: 'Ultra-hydrating 15-minute Korean facial sheet mask infused with Hyaluronic Acid and Aloe Vera.',
    price: 15,
    originalPrice: 49,
    stock: 100,
    SKU: 'DMG-BUD-001',
    images: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800'],
    rating: 4.9,
    reviewCount: 312,
    benefits: ['Instant 15-minute glass glow', 'Deeply hydrates dry skin', 'Calms redness'],
    ingredients: 'Aqua, Hyaluronic Acid, Aloe Barbadensis Leaf Extract, Glycerin, Witch Hazel.',
    howToUse: 'Unfold mask and press gently onto clean face. Leave for 15 minutes, then pat remaining serum into skin.',
    featured: true,
    bestSeller: true,
    newArrival: true,
    skinConcerns: ['Dryness', 'Dullness'],
    skinType: 'All'
  },
  {
    name: 'Rose Water Refreshing Cleansing Wipe (Pack of 5)',
    brand: 'DM-GLOWCART Beauty',
    category: 'Beauty & Personal Care',
    subcategory: 'Skincare',
    description: 'Gentle alcohol-free facial cleansing wipes soaked in pure Damask Rose Water.',
    price: 12,
    originalPrice: 30,
    stock: 120,
    SKU: 'DMG-BUD-002',
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'],
    rating: 4.8,
    reviewCount: 245,
    benefits: ['Removes waterproof makeup', '100% biodegradable cotton', 'Alcohol & paraben free'],
    ingredients: 'Pure Damask Rose Water, Chamomile Extract, Vitamin E, Aqua.',
    howToUse: 'Wipe gently across face and neck to clean oil and makeup. Reseal pouch tightly.',
    featured: true,
    bestSeller: true,
    newArrival: true,
    skinConcerns: ['Acne & Blemishes', 'Dullness'],
    skinType: 'All'
  },
  {
    name: 'Pure Aloe Vera Soothing Mini Gel Sachet (15ml)',
    brand: 'DM-GLOWCART Beauty',
    category: 'Beauty & Personal Care',
    subcategory: 'Skincare',
    description: '99% organic cold-pressed aloe vera mini gel sachet for instant skin cooling & hydration.',
    price: 19,
    originalPrice: 49,
    stock: 90,
    SKU: 'DMG-BUD-003',
    images: ['https://images.unsplash.com/photo-1567928256565-d726b2b73b52?w=800'],
    rating: 4.7,
    reviewCount: 189,
    benefits: ['Cools sunburnt skin', 'Reduces acne inflammation', 'Multi-use hair & face gel'],
    ingredients: '99% Organic Aloe Vera Leaf Juice, Tocopherol, Carbomer.',
    howToUse: 'Apply a small amount to clean skin or scalp whenever cooling hydration is needed.',
    featured: true,
    bestSeller: true,
    newArrival: true,
    skinConcerns: ['Acne & Blemishes', 'Sensitivity', 'Dryness'],
    skinType: 'Sensitive'
  },
  {
    name: 'Soft Pastel Cotton Hair Scrunchie',
    brand: 'GLOW ACCESSORIES',
    category: 'Accessories',
    subcategory: 'Hair Accessories',
    description: 'Ultra-soft snag-free cotton scrunchie designed to prevent hair breakage and creasing.',
    price: 15,
    originalPrice: 40,
    stock: 80,
    SKU: 'DMG-BUD-004',
    images: ['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800'],
    rating: 4.9,
    reviewCount: 160,
    benefits: ['Prevents hair breakage', 'Zero crease lines', 'Soft breathable cotton'],
    ingredients: '100% Breathable Cotton & Elastic Rubber Core.',
    howToUse: 'Wrap twice around ponytail or hair bun.',
    featured: true,
    bestSeller: true,
    newArrival: true,
    skinConcerns: [],
    skinType: 'All'
  },
  {
    name: 'Precision Teardrop Beauty Blender Sponge',
    brand: 'DM-GLOWCART Beauty',
    category: 'Beauty & Personal Care',
    subcategory: 'Makeup Tools',
    description: 'Latex-free teardrop makeup sponge for seamless foundation and concealer blending.',
    price: 18,
    originalPrice: 50,
    stock: 75,
    SKU: 'DMG-BUD-005',
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'],
    rating: 4.8,
    reviewCount: 275,
    benefits: ['Latex-free soft foam', 'Expands when wet', 'Streak-free finish'],
    ingredients: 'Non-latex Polyurethane Hydrophilic Foam.',
    howToUse: 'Wet sponge under water and squeeze out excess. Bounce foundation onto skin gently.',
    featured: true,
    bestSeller: true,
    newArrival: true,
    skinConcerns: ['Uneven Texture'],
    skinType: 'All'
  },
  {
    name: 'Mini Velvet Matte Lipstick - Ruby Red',
    brand: 'DM-GLOWCART Beauty',
    category: 'Beauty & Personal Care',
    subcategory: 'Makeup',
    description: 'Travel-friendly mini velvet matte lipstick delivering rich Ruby Red payoff with nourishing Shea Butter.',
    price: 20,
    originalPrice: 99,
    stock: 150,
    SKU: 'DMG-BUD-006',
    images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800'],
    rating: 4.9,
    reviewCount: 380,
    benefits: ['One-swipe velvet matte finish', 'Pocket & travel friendly', 'Shea Butter enriched'],
    ingredients: 'Shea Butter, Argan Oil, Macadamia Seed Oil, Red Pigments, Vitamin E.',
    howToUse: 'Glide directly onto lips starting from center outwards.',
    featured: true,
    bestSeller: true,
    newArrival: true,
    skinConcerns: ['Dryness'],
    skinType: 'All'
  },
  {
    name: 'Ayurvedic Kumkumadi Radiance Mini Facial Oil (5ml)',
    brand: 'DM-GLOWCART Beauty',
    category: 'Beauty & Personal Care',
    subcategory: 'Skincare',
    description: 'Traditional 100% pure Saffron & Chandan mini facial oil for radiant golden skin glow.',
    price: 20,
    originalPrice: 89,
    stock: 110,
    SKU: 'DMG-BUD-007',
    images: ['https://images.unsplash.com/photo-1608248597263-00079e96447c?w=800'],
    rating: 4.8,
    reviewCount: 215,
    benefits: ['100% Pure Kashmiri Saffron', 'Fades dark spots overnight', 'Golden skin glow'],
    ingredients: 'Kashmiri Saffron, Sandalwood Extract, Lotus Flower, Sesame Oil.',
    howToUse: 'Warm 2 drops in palms and press onto face before bedtime.',
    featured: true,
    bestSeller: true,
    newArrival: true,
    skinConcerns: ['Dullness', 'Pigmentation'],
    skinType: 'All'
  },

  // --- CORE CATALOG PRODUCTS ---
  {
    name: 'Glow Perfect Primer',
    brand: 'DM-GLOWCART Beauty',
    category: 'Beauty & Personal Care',
    subcategory: 'Makeup',
    description: 'Silky smooth pore-blurring face primer for long-lasting radiant makeup.',
    price: 599,
    originalPrice: 799,
    stock: 25,
    SKU: 'DMG-BTY-001',
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'],
    rating: 4.8,
    reviewCount: 142,
    benefits: ['Blurs pores instantly', 'Hydrating formula', 'Extends makeup wear up to 16h'],
    ingredients: 'Dimethicone, Silica, Tocopherol (Vitamin E), Hyaluronic Acid.',
    howToUse: 'Smooth a small drop evenly over clean skin before foundation application.',
    featured: true,
    bestSeller: true,
    newArrival: false,
    skinConcerns: ['Open Pores', 'Uneven Texture', 'Dryness'],
    skinType: 'All'
  },
  {
    name: 'Flawless Finish Foundation',
    brand: 'DM-GLOWCART Beauty',
    category: 'Beauty & Personal Care',
    subcategory: 'Makeup',
    description: 'Lightweight buildable medium-to-full coverage liquid foundation with SPF 20.',
    price: 899,
    originalPrice: 1199,
    stock: 30,
    SKU: 'DMG-BTY-002',
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'],
    rating: 4.7,
    reviewCount: 98,
    benefits: ['Natural satin finish', 'Non-comedogenic', 'Transfer-resistant'],
    ingredients: 'Water, Cyclopentasiloxane, Titanium Dioxide, Niacinamide, Glycerin.',
    howToUse: 'Apply 1-2 pumps onto face using a makeup sponge or foundation brush.',
    featured: true,
    bestSeller: true,
    newArrival: false,
    skinConcerns: ['Uneven Tone', 'Pigmentation', 'Acne Marks'],
    skinType: 'Combination'
  },
  {
    name: 'HD Concealer',
    brand: 'DM-GLOWCART Beauty',
    category: 'Beauty & Personal Care',
    subcategory: 'Makeup',
    description: 'High-definition full coverage liquid concealer for dark circles and spots.',
    price: 499,
    originalPrice: 649,
    stock: 18,
    SKU: 'DMG-BTY-003',
    images: ['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800'],
    rating: 4.6,
    reviewCount: 85,
    benefits: ['Crease-proof', 'Dark circle eraser', 'Crease-free matte finish'],
    ingredients: 'Aqua, Isododecane, Glycerin, Caffeine Extract, Vitamin E.',
    howToUse: 'Dot under eyes and over blemishes. Blend outwards gently.',
    featured: false,
    bestSeller: true,
    newArrival: false,
    skinConcerns: ['Dark Circles', 'Blemishes', 'Fine Lines'],
    skinType: 'All'
  },
  {
    name: 'Soft Matte Compact Powder',
    brand: 'DM-GLOWCART Beauty',
    category: 'Beauty & Personal Care',
    subcategory: 'Makeup',
    description: 'Oil-control pressed powder for a soft-focus matte perfection all day.',
    price: 399,
    originalPrice: 499,
    stock: 40,
    SKU: 'DMG-BTY-004',
    images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800'],
    rating: 4.5,
    reviewCount: 64,
    benefits: ['Shine control for 8h', 'Ultra-light texture', 'Sun protection SPF 15'],
    ingredients: 'Talc, Mica, Zinc Oxide, Vitamin E, Rosemary Extract.',
    howToUse: 'Dust lightly over face using puff or powder brush to set makeup.',
    featured: false,
    bestSeller: false,
    newArrival: false,
    skinConcerns: ['Oily Skin', 'Shine', 'Open Pores'],
    skinType: 'Oily'
  },
  {
    name: 'Rosy Glow Blush',
    brand: 'DM-GLOWCART Beauty',
    category: 'Beauty & Personal Care',
    subcategory: 'Makeup',
    description: 'Silky smooth powder blush delivering a flush of healthy rosy color.',
    price: 449,
    originalPrice: 599,
    stock: 22,
    SKU: 'DMG-BTY-005',
    images: ['https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?w=800'],
    rating: 4.9,
    reviewCount: 110,
    benefits: ['Highly pigmented', 'Blendable formula', 'Natural glow finish'],
    ingredients: 'Mica, Magnesium Stearate, Jojoba Seed Oil, Rosehip Oil.',
    howToUse: 'Sweep onto apples of cheeks using a fluffy blush brush.',
    featured: true,
    bestSeller: true,
    newArrival: true,
    skinConcerns: ['Dullness'],
    skinType: 'All'
  },
  {
    name: 'Golden Hour Highlighter',
    brand: 'DM-GLOWCART Beauty',
    category: 'Beauty & Personal Care',
    subcategory: 'Makeup',
    description: 'Luminous champagne gold powder highlighter for intense glass skin shine.',
    price: 549,
    originalPrice: 749,
    stock: 15,
    SKU: 'DMG-BTY-006',
    images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800'],
    rating: 4.8,
    reviewCount: 92,
    benefits: ['Blinding golden shimmer', 'Zero chunky glitter', 'Long-wearing luminous glow'],
    ingredients: 'Synthetic Fluorphlogopite, Mica, Pearl Powder, Vitamin E.',
    howToUse: 'Apply to high points of face: cheekbones, nose tip, Cupid\'s bow.',
    featured: true,
    bestSeller: false,
    newArrival: true,
    skinConcerns: ['Dullness'],
    skinType: 'All'
  },
  {
    name: 'Velvet Matte Lipstick',
    brand: 'DM-GLOWCART Beauty',
    category: 'Beauty & Personal Care',
    subcategory: 'Makeup',
    description: 'Rich bullet lipstick delivering comfortable plush velvet matte color.',
    price: 499,
    originalPrice: 649,
    stock: 28,
    SKU: 'DMG-BTY-011',
    images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800'],
    rating: 4.9,
    reviewCount: 188,
    benefits: ['Non-drying formula', 'One-swipe full coverage', 'Enriched with Shea Butter'],
    ingredients: 'Shea Butter, Argan Oil, Macadamia Seed Oil, Red Pigments.',
    howToUse: 'Apply directly onto lips starting from center to outer edges.',
    featured: true,
    bestSeller: true,
    newArrival: false,
    skinConcerns: [],
    skinType: 'All'
  },
  {
    name: 'Hydrating Face Serum with 10% Niacinamide',
    brand: 'DM-GLOWCART Beauty',
    category: 'Beauty & Personal Care',
    subcategory: 'Skincare',
    description: 'Advanced brightening facial serum that fades dark spots and minimizes open pores.',
    price: 649,
    originalPrice: 899,
    stock: 35,
    SKU: 'DMG-SKN-016',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800'],
    rating: 4.9,
    reviewCount: 220,
    benefits: ['Fades hyperpigmentation in 2 weeks', 'Controls excess sebum', 'Smooths skin texture'],
    ingredients: '10% Niacinamide, 1% Zinc PCA, Hyaluronic Acid, Aloe Vera Extract.',
    howToUse: 'Apply 3-4 drops onto cleansed face morning and night before moisturizer.',
    featured: true,
    bestSeller: true,
    newArrival: true,
    skinConcerns: ['Pigmentation', 'Acne Marks', 'Open Pores'],
    skinType: 'Oily'
  },
  {
    name: 'Vitamin C Brightening Glow Moisturizer',
    brand: 'DM-GLOWCART Beauty',
    category: 'Beauty & Personal Care',
    subcategory: 'Skincare',
    description: 'Lightweight gel-cream moisturizer packed with Kakadu Plum Vitamin C.',
    price: 599,
    originalPrice: 799,
    stock: 30,
    SKU: 'DMG-SKN-017',
    images: ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800'],
    rating: 4.8,
    reviewCount: 145,
    benefits: ['Restores radiant skin glow', '24h non-greasy hydration', 'Fights free radicals'],
    ingredients: 'Kakadu Plum Extract, Vitamin C (Ethyl Ascorbic Acid), Squalane, Ceramide NP.',
    howToUse: 'Massage gently over face and neck morning and evening.',
    featured: true,
    bestSeller: true,
    newArrival: false,
    skinConcerns: ['Dullness', 'Uneven Tone'],
    skinType: 'All'
  },
  {
    name: 'Floral Print Cotton Anarkali Kurta',
    brand: 'GLOW FASHION',
    category: 'Fashion',
    subcategory: 'Ethnic Wear',
    description: 'Breathable 100% pure cotton flared Anarkali kurta with handcrafted gold piping.',
    price: 1299,
    originalPrice: 1999,
    stock: 15,
    SKU: 'DMG-FSH-024',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'],
    rating: 4.8,
    reviewCount: 88,
    benefits: ['100% Pure Premium Cotton', 'Breathable all-day wear', 'Hand-printed floral motif'],
    ingredients: '100% Comb Cotton Cloth.',
    howToUse: 'Pair with churidar or leggings for festive occasions.',
    featured: true,
    bestSeller: true,
    newArrival: false,
    skinConcerns: [],
    skinType: 'All'
  },
  {
    name: 'Rose & Vanilla Scented Soy Candle',
    brand: 'GLOW HOME',
    category: 'Home & Lifestyle',
    subcategory: 'Home Fragrance',
    description: 'Hand-poured 100% natural soy wax candle delivering a warm romantic fragrance.',
    price: 549,
    originalPrice: 799,
    stock: 25,
    SKU: 'DMG-HOM-031',
    images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800'],
    rating: 4.9,
    reviewCount: 130,
    benefits: ['Clean 45h burn time', 'Zero toxic paraffin', 'Relieves stress & anxiety'],
    ingredients: '100% Natural Soy Wax, Essential Oils, Organic Cotton Wick.',
    howToUse: 'Trim wick to 1/4 inch before lighting. Allow wax pool to reach glass edges.',
    featured: true,
    bestSeller: true,
    newArrival: false,
    skinConcerns: [],
    skinType: 'All'
  }
];

const seedDatabase = async () => {
  const uri = process.env.MONGO_URI || 'mongodb+srv://Monisha:monisha123@cluster0.nfpi4z1.mongodb.net/dm-glowcart?retryWrites=true&w=majority';

  try {
    console.log('Connecting to your personal MongoDB Atlas Cluster...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected to MongoDB Atlas Cluster successfully!');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await Category.deleteMany({});

    console.log('Cleared existing database collections.');

    // Seed Admin User
    const adminUser = await User.create({
      name: 'DM-GLOWCART Admin',
      email: 'admin@glowcart.com',
      password: 'Admin@123',
      role: 'ADMIN',
      phone: '+91 9876543210',
      isActive: true
    });
    console.log(`Created Admin User: ${adminUser.email}`);

    // Seed Standard Demo User
    const demoUser = await User.create({
      name: 'Monisha User',
      email: 'user@glowcart.com',
      password: 'User@123',
      role: 'USER',
      phone: '+91 9876543211',
      isActive: true
    });
    console.log(`Created Demo User: ${demoUser.email}`);

    // Seed Categories
    const categoriesData = [
      {
        name: 'Beauty & Personal Care',
        slug: 'beauty-personal-care',
        description: 'Premium cosmetics, skincare serums, and grooming tools.',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'
      },
      {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Chic ethnic wear, sarees, tops, and stylish apparel.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Vegan leather totes, 18K gold plated jewelry, and silk scrunchies.',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'
      },
      {
        name: 'Home & Lifestyle',
        slug: 'home-lifestyle',
        description: 'Scented soy candles, facial Gua Sha tools, and cozy satin bedding.',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800'
      }
    ];

    await Category.insertMany(categoriesData);
    console.log('Created 4 Categories.');

    // Seed Coupons
    const couponsData = [
      {
        code: 'GLOW10',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minimumOrder: 300,
        maximumDiscount: 200,
        usageLimit: 500,
        expiryDate: new Date('2027-12-31')
      },
      {
        code: 'WELCOME15',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        minimumOrder: 500,
        maximumDiscount: 350,
        usageLimit: 300,
        expiryDate: new Date('2027-12-31')
      },
      {
        code: 'BEAUTY20',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minimumOrder: 999,
        maximumDiscount: 500,
        usageLimit: 200,
        expiryDate: new Date('2027-12-31')
      }
    ];

    await Coupon.insertMany(couponsData);
    console.log('Created 3 Coupons (GLOW10, WELCOME15, BEAUTY20).');

    // Seed Products
    await Product.insertMany(productsData);
    console.log(`Successfully seeded ${productsData.length} Products into MongoDB!`);

    console.log('\n--- SEEDING COMPLETED SUCCESSFULLY ---');
    console.log('Admin Credentials: admin@glowcart.com / Admin@123');
    console.log('Demo User Credentials: user@glowcart.com / User@123');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error.message);
    process.exit(1);
  }
};

module.exports = { productsData, seedDatabase };

if (require.main === module) {
  seedDatabase();
}
