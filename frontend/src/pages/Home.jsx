import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones, Tag, Star, Award } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import ImageWithFallback from '../components/ImageWithFallback';

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [budgetProducts, setBudgetProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [trendingRes, bestRes, newRes, budgetRes] = await Promise.all([
          API.get('/products?featured=true&limit=8'),
          API.get('/products?bestSeller=true&limit=8'),
          API.get('/products?newArrival=true&limit=8'),
          API.get('/products?maxPrice=20&limit=8')
        ]);

        if (trendingRes.data.success) setTrendingProducts(trendingRes.data.data);
        if (bestRes.data.success) setBestsellers(bestRes.data.data);
        if (newRes.data.success) setNewArrivals(newRes.data.data);
        if (budgetRes.data.success) setBudgetProducts(budgetRes.data.data);
      } catch (error) {
        console.error('Home data load error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-900 via-glow-800 to-amber-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-500/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-glow-200 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>B.Sc. IT Final Year Showcase • DM-GLOWCART</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white">
              Glow More. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200">
                Shop Smarter.
              </span>
            </h1>

            <p className="text-slate-200 text-base sm:text-lg max-w-xl font-normal leading-relaxed mx-auto lg:mx-0">
              Discover beauty, fashion and everyday essentials curated for you. Authentic formulas, instant glowing results, and fast delivery to your doorstep.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-glow-500 to-rose-600 hover:from-glow-600 hover:to-rose-700 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-lg shadow-glow transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/glow-match"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-8 py-4 rounded-2xl backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>GLOW MATCH FINDER</span>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/10 text-center lg:text-left">
              <div>
                <span className="block text-2xl font-bold text-white">50+</span>
                <span className="text-xs text-rose-200">Curated Products</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">100%</span>
                <span className="text-xs text-rose-200">Genuine Brands</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">4.9★</span>
                <span className="text-xs text-rose-200">Customer Rating</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-4 bg-gradient-to-r from-rose-500 to-amber-500 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800"
                  alt="DM-GLOWCART Beauty Collection"
                  className="w-full h-80 object-cover rounded-2xl shadow-md"
                />
                <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-rose-100">
                  <div className="w-10 h-10 rounded-xl bg-glow-100 text-glow-600 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold">Glow Perfect Primer</span>
                    <span className="text-[11px] text-glow-600 font-bold">₹599 • Best Seller</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-glow-600">Curated Collections</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Shop By Category</h2>
          </div>
          <Link to="/shop" className="text-xs font-bold text-glow-600 hover:text-glow-700 flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              name: 'Beauty & Personal Care',
              itemCount: '25+ Products',
              img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
              query: 'Beauty & Personal Care'
            },
            {
              name: 'Fashion Apparel',
              itemCount: '10+ Products',
              img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
              query: 'Fashion'
            },
            {
              name: 'Accessories',
              itemCount: '12+ Products',
              img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
              query: 'Accessories'
            },
            {
              name: 'Home & Lifestyle',
              itemCount: '15+ Products',
              img: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800',
              query: 'Home & Lifestyle'
            }
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={`/shop?category=${encodeURIComponent(cat.query)}`}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-64 border border-rose-100 flex flex-col justify-end"
            >
              <ImageWithFallback
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>
              <div className="relative p-5 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">{cat.itemCount}</span>
                <h3 className="text-lg font-bold font-serif group-hover:text-rose-200 transition-colors">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Under ₹20 Budget Deals Section */}
      {budgetProducts && budgetProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/20 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-sm">
                  🔥 Mega Budget Offer • Under ₹20
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2">
                  Pocket-Friendly Beauty Deals
                </h2>
              </div>
              <Link
                to="/shop?maxPrice=20"
                className="bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>View All Under ₹20</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {budgetProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-glow-600">Trending Now</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Featured Essentials</h2>
          </div>
          <Link to="/shop?featured=true" className="text-xs font-bold text-glow-600 hover:text-glow-700 flex items-center gap-1">
            Explore All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Smart Glow Match Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-100 via-pink-50 to-amber-100 rounded-3xl p-8 sm:p-12 border border-rose-200/60 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-glow-600 text-xs font-bold shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Smart Beauty Recommendation Engine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900">
              Not sure which skincare product suits your skin?
            </h2>
            <p className="text-sm text-slate-600">
              Use our intelligent <strong>Glow Match</strong> tool to answer 4 quick questions and get instant tailored beauty recommendations.
            </p>
            <Link
              to="/glow-match"
              className="inline-flex items-center gap-2 bg-glow-600 hover:bg-glow-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-glow transition-all duration-200 hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>START GLOW MATCH FINDER</span>
            </Link>
          </div>
          <div className="w-48 h-48 rounded-full bg-white p-3 shadow-xl border border-rose-200 shrink-0 flex items-center justify-center overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800"
              alt="Glow Match AI"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-glow-600">Most Loved</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Customer Bestsellers</h2>
          </div>
          <Link to="/shop?bestSeller=true" className="text-xs font-bold text-glow-600 hover:text-glow-700 flex items-center gap-1">
            View Bestsellers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestsellers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Coupon Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <Tag className="w-4 h-4" />
              <span>Special Offer Codes</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold">Use Code: WELCOME15 & Get 15% OFF</h3>
            <p className="text-xs text-slate-400">Valid on orders over ₹500. Enter code at checkout step for instant discount.</p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Link
              to="/shop"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
            >
              CLAIM OFFER NOW
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
