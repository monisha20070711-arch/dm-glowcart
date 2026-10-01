import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';

const Wishlist = () => {
  const { wishlist, loading } = useWishlist();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glow-600"></div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Save your favorite beauty and lifestyle items by clicking the heart icon on any product."
          actionText="Discover Products"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">My Wishlist</h1>
        <p className="text-xs text-slate-500 mt-1">
          You have <strong className="text-slate-800">{wishlist.length}</strong> saved product(s)
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
