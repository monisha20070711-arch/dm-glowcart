import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Package,
  MapPin,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import API from '../services/api';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setShowSuggestions(false);
  }, [location]);

  // Handle Search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          const res = await API.get(`/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
          if (res.data.success) {
            setSuggestions(res.data.data);
            setShowSuggestions(true);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-glow-700 via-glow-600 to-amber-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>Free Express Delivery on orders above ₹499 | Use Code <strong>WELCOME15</strong> for 15% OFF!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-glow-600"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-glow-600 to-rose-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-slate-900 group-hover:text-glow-600 transition-colors">
                DM-GLOWCART
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-glow-600 uppercase">
                Everyday Essentials
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search beauty, foundation, lipstick, skincare..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-glow-500 focus:bg-white rounded-full py-2.5 pl-11 pr-4 text-sm outline-none transition-all duration-200"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </form>

            {/* Live Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden z-50">
                <div className="p-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 pt-3">
                  Matching Products
                </div>
                {suggestions.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-rose-50/60 transition-colors border-b border-slate-50 last:border-none"
                  >
                    <img
                      src={item.images && item.images[0]}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[11px] text-glow-600 font-bold">₹{item.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link to="/" className="hover:text-glow-600 transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-glow-600 transition-colors">Shop All</Link>
            <Link to="/glow-match" className="flex items-center gap-1 text-glow-600 hover:text-glow-700 font-bold bg-glow-50 px-3 py-1.5 rounded-full border border-glow-200">
              <Sparkles className="w-4 h-4" />
              Glow Match
            </Link>
            <Link to="/shop?bestSeller=true" className="hover:text-glow-600 transition-colors">Bestsellers</Link>
            <Link to="/shop?newArrival=true" className="hover:text-glow-600 transition-colors">New Arrivals</Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-700 hover:text-glow-600 transition-colors rounded-full hover:bg-rose-50"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-glow-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:text-glow-600 transition-colors rounded-full hover:bg-rose-50"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-glow-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile Menu */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 rounded-full border border-rose-200 hover:border-glow-500 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-glow-500 to-rose-400 text-white flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-rose-100 py-2 z-50">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="mt-1 inline-block bg-glow-100 text-glow-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            Admin Account
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-glow-700 bg-rose-50/70 hover:bg-rose-100 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-rose-50 transition-colors">
                        <UserIcon className="w-4 h-4" /> My Profile
                      </Link>
                      <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-rose-50 transition-colors">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <Link to="/addresses" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-rose-50 transition-colors">
                        <MapPin className="w-4 h-4" /> Addresses
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100 mt-1"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-glow-600 hover:bg-glow-700 text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm transition-all duration-200 hover:scale-105"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-xs outline-none focus:border-glow-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-rose-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link to="/" className="block py-2 text-sm font-semibold text-slate-800 border-b border-slate-50">Home</Link>
          <Link to="/shop" className="block py-2 text-sm font-semibold text-slate-800 border-b border-slate-50">Shop All Products</Link>
          <Link to="/glow-match" className="block py-2 text-sm font-bold text-glow-600 border-b border-slate-50">✨ Glow Match AI Finder</Link>
          <Link to="/shop?bestSeller=true" className="block py-2 text-sm font-semibold text-slate-800 border-b border-slate-50">Bestsellers</Link>
          <Link to="/shop?newArrival=true" className="block py-2 text-sm font-semibold text-slate-800 border-b border-slate-50">New Arrivals</Link>
          <Link to="/contact" className="block py-2 text-sm font-semibold text-slate-800">Contact Us</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
