# DM-GLOWCART — Full-Stack Beauty & Lifestyle E-Commerce Application

> **Tagline:** Everyday Essentials, Made Better  
> **Project Type:** B.Sc. Information Technology Final-Year Project  
> **Developer:** Monisha (Tiruppur, Tamil Nadu, India)  
> **Support Email:** monisha20070711@gmail.com

---

## 🌟 Executive Overview

**DM-GLOWCART** is a production-grade full-stack e-commerce web platform inspired by top-tier online beauty destinations (such as Nykaa and Purplle), featuring a completely **original brand identity, luxury Rose Gold UI styling**, and complete end-to-end functionality.

It is NOT a frontend mock or prototype. All products, user accounts, shopping carts, wishlists, address books, coupons, orders, and payment transactions are persisted in a **MongoDB** database via a robust **Node.js + Express REST API**.

---

## ✨ Key Technical Highlights

1. **JWT Authentication & Security**: Password hashing with `bcryptjs` (10 rounds) and protected User/Admin routes.
2. **Razorpay TEST MODE Integration**: Backend order creation (`POST /api/payment/create-order`) and HMAC-SHA256 signature verification (`POST /api/payment/verify`).
3. **Smart "Glow Match" AI Beauty Recommendation**: Intelligent 4-step survey matching skin concerns, skin type, category, and budget.
4. **Complete Admin Suite**: Analytics dashboard with Recharts visualizations, Product CRUD, Order Status workflow updater (Pending → Confirmed → Packed → Shipped → Out for Delivery → Delivered), User account status toggles, and Coupon Manager.
5. **Exact Starting Prices & Products**: Pre-seeded with 40+ products including exact required items (*Glow Perfect Primer ₹599*, *Flawless Finish Foundation ₹899*, *HD Concealer ₹499*, etc.).
6. **Robust Image Fallback Architecture**: Handled by custom React `ImageWithFallback` component to eliminate broken image icon placeholders.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **State Management**: React Context API (`AuthContext`, `CartContext`, `WishlistContext`, `ToastContext`)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Data Visualization**: Recharts

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (MVC Architecture)
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: JSON Web Token (JWT) & bcryptjs
- **Payment Gateway**: Razorpay Node SDK & Crypto HMAC Signature Verification

---

## 📁 Repository & Folder Structure

```
dm-glowcart/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Express route handlers
│   ├── middleware/      # JWT auth guard, Admin authorization, Error middleware
│   ├── models/          # Mongoose Schemas (User, Product, Cart, Wishlist, Order, Coupon, Address, Review, Contact)
│   ├── routes/          # API route definitions
│   ├── utils/           # Token generation helper
│   ├── seed.js          # Database seed script (50+ products, admin, coupons)
│   ├── server.js        # Express app server entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, ProductCard, RatingStars, SkeletonCard, EmptyState, ImageWithFallback, ProtectedRoute
│   │   ├── context/     # AuthContext, CartContext, WishlistContext, ToastContext
│   │   ├── pages/       # Home, Shop, ProductDetail, Cart, Checkout, OrderSuccess, OrderHistory, OrderTrack, Wishlist, GlowMatch, Profile, Contact, About, Admin Dashboard & Management
│   │   ├── services/    # Axios API client setup
│   │   ├── App.jsx      # Router configuration
│   │   ├── main.jsx     # Vite DOM renderer
│   │   └── index.css    # Tailwind CSS directives
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally (`mongodb://127.0.0.1:27017/dm-glowcart`) or MongoDB Atlas connection URI

### 1. Backend Setup
```bash
cd backend
npm install
node seed.js    # Seeds 50+ products, Admin account & Demo coupons
npm run dev     # Starts backend server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev     # Starts Vite frontend on http://localhost:3000
```

---

## 🔑 Demo Account Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@glowcart.com` | `Admin@123` |
| **User** | `user@glowcart.com` | `User@123` |

### Sample Demo Coupons
- `WELCOME15`: 15% OFF (Min Order: ₹500)
- `GLOW10`: 10% OFF (Min Order: ₹300)
- `BEAUTY20`: 20% OFF (Min Order: ₹999)

---

## 📡 Key REST API Reference

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | Public | Register new user |
| `/api/auth/login` | POST | Public | Login and receive JWT token |
| `/api/products` | GET | Public | Search, filter, sort & paginate products |
| `/api/cart` | GET / POST | User | Retrieve & add items to MongoDB cart |
| `/api/wishlist` | GET / POST | User | Manage user wishlist |
| `/api/coupons/validate` | POST | User | Validate coupon code & return discount |
| `/api/payment/create-order` | POST | User | Calculate final total & create Razorpay order |
| `/api/payment/verify` | POST | User | Verify HMAC signature & confirm order |
| `/api/recommendations/glow-match` | POST | Public | Smart Glow Match finder recommendations |
| `/api/admin/analytics` | GET | Admin | Retrieve sales & dashboard analytics |
