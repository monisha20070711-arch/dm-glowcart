import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Sparkles } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import RatingStars from './RatingStars';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const outOfStock = product.stock <= 0;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!outOfStock) {
      addToCart(product._id, 1);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-rose-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.discount > 0 && (
          <span className="bg-glow-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            {product.discount}% OFF
          </span>
        )}
        {product.bestSeller && (
          <span className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
            Bestseller
          </span>
        )}
        {product.newArrival && (
          <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
            New
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
          inWishlist
            ? 'bg-rose-50 text-glow-600 shadow-md scale-110'
            : 'bg-white/80 text-slate-400 hover:text-glow-600 hover:bg-white'
        }`}
        title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-glow-600' : ''}`} />
      </button>

      {/* Product Image Link */}
      <Link to={`/product/${product._id}`} className="block overflow-hidden relative">
        <ImageWithFallback
          src={product.images && product.images[0]}
          alt={product.name}
          className="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {outOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md shadow">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-glow-600">
            {product.brand || 'DM-GLOWCART'}
          </span>

          <Link to={`/product/${product._id}`} className="block mt-1">
            <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-glow-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          <div className="mt-2 flex items-center justify-between">
            <RatingStars rating={product.rating || 4.5} count={product.reviewCount} />
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-900">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm ${
              outOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-glow-600 hover:bg-glow-700 text-white active:scale-95 hover:shadow-glow'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{outOfStock ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
