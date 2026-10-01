import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Plus,
  Minus,
  Star,
  CheckCircle2
} from 'lucide-react';
import API from '../services/api';
import ImageWithFallback from '../components/ImageWithFallback';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        if (res.data.success) {
          const prod = res.data.data;
          setProduct(prod);
          setSelectedImage(prod.images && prod.images[0] ? prod.images[0] : '');

          // Fetch related products by category
          const relRes = await API.get(`/products?category=${encodeURIComponent(prod.category)}&limit=4`);
          if (relRes.data.success) {
            setRelatedProducts(relRes.data.data.filter((p) => p._id !== id));
          }

          // Fetch reviews
          const revRes = await API.get(`/reviews/product/${id}`);
          if (revRes.data.success) {
            setReviews(revRes.data.data.reviews);
            setReviewStats(revRes.data.data.stats);
          }
        }
      } catch (error) {
        console.error('Fetch product detail error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glow-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product not found</h2>
        <Link to="/shop" className="text-glow-600 font-bold hover:underline mt-4 inline-block">
          Return to Shop
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const outOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (!outOfStock) {
      addToCart(product._id, quantity);
    }
  };

  const handleBuyNow = async () => {
    if (!outOfStock) {
      const success = await addToCart(product._id, quantity);
      if (success) {
        navigate('/cart');
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please log in to submit a review', 'info');
      return;
    }
    try {
      setSubmittingReview(true);
      const res = await API.post(`/reviews/product/${id}`, {
        rating: newRating,
        title: newTitle,
        comment: newComment
      });

      if (res.data.success) {
        showToast('Review submitted successfully!', 'success');
        setReviews([res.data.data, ...reviews]);
        setNewComment('');
        setNewTitle('');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit review';
      showToast(msg, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-glow-600">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-glow-600">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-glow-600">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Product Images Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border border-rose-100 bg-white shadow-sm">
            <ImageWithFallback
              src={selectedImage}
              alt={product.name}
              className="w-full h-96 sm:h-[450px] object-cover object-center"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-glow-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-glow-600 scale-105 shadow-md' : 'border-rose-100 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Info */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-glow-600">
              {product.brand || 'DM-GLOWCART'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-4">
              <RatingStars rating={product.rating || 4.5} count={product.reviewCount} size="md" />
              <span className="text-xs text-slate-400">SKU: {product.SKU}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-slate-400 line-through font-medium">₹{product.originalPrice}</span>
            )}
            {product.discount > 0 && (
              <span className="text-xs font-bold text-glow-700 bg-white px-2.5 py-1 rounded-full shadow-sm">
                Save ₹{product.originalPrice - product.price}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Stock Status */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span>Availability:</span>
            {outOfStock ? (
              <span className="text-rose-600 font-bold">Out of Stock</span>
            ) : (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> In Stock ({product.stock} units left)
              </span>
            )}
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-rose-200 rounded-xl bg-white">
                <button
                  disabled={quantity <= 1 || outOfStock}
                  onClick={() => setQuantity(quantity - 1)}
                  className="p-2 text-slate-600 hover:text-glow-600 disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-xs font-bold text-slate-800">{quantity}</span>
                <button
                  disabled={quantity >= product.stock || outOfStock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-600 hover:text-glow-600 disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="flex-1 bg-glow-600 hover:bg-glow-700 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-glow transition-all duration-200 flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={outOfStock}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <span>Buy Now</span>
              </button>

              <button
                onClick={() => (inWishlist ? removeFromWishlist(product._id) : addToWishlist(product._id))}
                className={`p-3.5 rounded-2xl border transition-all ${
                  inWishlist
                    ? 'bg-rose-50 border-glow-300 text-glow-600 shadow'
                    : 'bg-white border-rose-200 text-slate-500 hover:text-glow-600'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-glow-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Delivery & Trust Features */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <Truck className="w-5 h-5 text-glow-600 mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-slate-800">Free Shipping</span>
              <span className="text-[10px] text-slate-400">Orders over ₹499</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-glow-600 mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-slate-800">100% Authentic</span>
              <span className="text-[10px] text-slate-400">Guaranteed quality</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <RefreshCw className="w-5 h-5 text-glow-600 mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-slate-800">7-Day Return</span>
              <span className="text-[10px] text-slate-400">Easy replacement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Benefits, Ingredients, How to Use, Reviews */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm">
        <div className="flex border-b border-slate-100 overflow-x-auto gap-6">
          {[
            { id: 'description', label: 'Description' },
            { id: 'benefits', label: 'Benefits' },
            { id: 'ingredients', label: 'Ingredients' },
            { id: 'howToUse', label: 'How to Use' },
            { id: 'reviews', label: `Reviews (${reviews.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-glow-600 text-glow-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-6 text-xs text-slate-600 leading-relaxed">
          {activeTab === 'description' && (
            <div className="space-y-3">
              <p>{product.description}</p>
              {product.skinConcerns && product.skinConcerns.length > 0 && (
                <div className="pt-3">
                  <strong className="text-slate-800 block mb-1">Targeted Skin Concerns:</strong>
                  <div className="flex flex-wrap gap-2">
                    {product.skinConcerns.map((sc, i) => (
                      <span key={i} className="bg-rose-50 text-glow-700 px-3 py-1 rounded-full font-semibold">
                        {sc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'benefits' && (
            <ul className="space-y-2">
              {product.benefits && product.benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-glow-500 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'ingredients' && (
            <p className="bg-slate-50 p-4 rounded-2xl font-mono text-slate-700">
              {product.ingredients}
            </p>
          )}

          {activeTab === 'howToUse' && (
            <p className="bg-slate-50 p-4 rounded-2xl font-sans">
              {product.howToUse}
            </p>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Write a Review */}
              <form onSubmit={handleReviewSubmit} className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100 space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Write a Review for {product.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Review title (e.g. Amazing texture & glow!)"
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-glow-500"
                />
                <textarea
                  rows="3"
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tell us what you liked about this product..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-glow-500"
                ></textarea>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-glow-600 hover:bg-glow-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-glow"
                >
                  {submittingReview ? 'Submitting...' : 'Post Customer Review'}
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-slate-400 italic">No customer reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev._id} className="p-4 border-b border-slate-100 last:border-none space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{rev.userName}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Verified Purchase</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <RatingStars rating={rev.rating} showNumeric={false} />
                      <h5 className="font-semibold text-slate-800 text-xs mt-1">{rev.title}</h5>
                      <p className="text-slate-600 text-xs">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-xl font-serif font-bold text-slate-900">You May Also Like</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
