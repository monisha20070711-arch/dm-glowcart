import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Heart, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import EmptyState from '../components/EmptyState';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, cartSubtotal } = useCart();
  const { addToWishlist } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const items = cart.items || [];

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setValidatingCoupon(true);
      const res = await API.post('/coupons/validate', {
        code: couponCode,
        cartAmount: cartSubtotal
      });

      if (res.data.success) {
        setAppliedCoupon(res.data.data);
        showToast(res.data.message, 'success');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid coupon code';
      showToast(msg, 'error');
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    showToast('Coupon removed', 'info');
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const netSubtotal = Math.max(0, cartSubtotal - discountAmount);
  const deliveryCharge = netSubtotal >= 499 || items.length === 0 ? 0 : 49;
  const grandTotal = netSubtotal + deliveryCharge;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glow-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Cart is Empty"
          description="Explore our best-selling beauty and lifestyle products and add items to your cart."
          actionText="Explore Shop"
          actionLink="/shop"
        />
      </div>
    );
  }

  const handleMoveToWishlist = (product) => {
    addToWishlist(product._id);
    removeFromCart(product._id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Shopping Cart</h1>
        <p className="text-xs text-slate-500 mt-1">
          You have <strong className="text-slate-800">{items.length}</strong> unique item(s) in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-rose-100 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={product.images && product.images[0]}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl border border-slate-100 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-glow-600">
                      {product.brand}
                    </span>
                    <Link to={`/product/${product._id}`} className="block text-sm font-semibold text-slate-800 hover:text-glow-600">
                      {product.name}
                    </Link>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-sm font-bold text-slate-900">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-none border-slate-100">
                  <div className="flex items-center border border-rose-200 rounded-xl bg-slate-50">
                    <button
                      onClick={() => updateQuantity(product._id, item.quantity - 1)}
                      className="p-1.5 text-slate-600 hover:text-glow-600 disabled:opacity-40"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(product._id, item.quantity + 1)}
                      className="p-1.5 text-slate-600 hover:text-glow-600 disabled:opacity-40"
                      disabled={item.quantity >= product.stock}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="block text-sm font-bold text-slate-900">₹{product.price * item.quantity}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMoveToWishlist(product)}
                      className="p-2 text-slate-400 hover:text-glow-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Move to Wishlist"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Coupon Box */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Code Section */}
          <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Tag className="w-4 h-4 text-glow-600" />
              <span>Apply Promo Coupon</span>
            </div>

            {appliedCoupon ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-emerald-800">Coupon {appliedCoupon.code} Applied</span>
                  <span className="text-[11px] text-emerald-600">You save ₹{appliedCoupon.discountAmount}</span>
                </div>
                <button onClick={removeCoupon} className="text-xs font-bold text-rose-600 hover:underline">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter GLOW10 or WELCOME15"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase outline-none focus:border-glow-500"
                />
                <button
                  type="submit"
                  disabled={validatingCoupon}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            <div className="pt-2 text-[11px] text-slate-400">
              Try: <strong className="text-glow-600">WELCOME15</strong> (15% OFF) or <strong className="text-glow-600">GLOW10</strong> (10% OFF)
            </div>
          </div>

          {/* Price Calculations */}
          <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold text-slate-900">
                  {deliveryCharge === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryCharge}`}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Grand Total</span>
              <span className="text-xl font-bold text-glow-600">₹{grandTotal}</span>
            </div>

            <button
              onClick={() => navigate('/checkout', { state: { appliedCoupon, discountAmount, deliveryCharge, grandTotal } })}
              className="w-full bg-gradient-to-r from-glow-600 to-rose-600 hover:from-glow-700 hover:to-rose-700 text-white font-bold text-sm py-3.5 rounded-2xl shadow-glow transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
