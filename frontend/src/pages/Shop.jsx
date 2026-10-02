import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RefreshCw, X, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular');
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Categories list
  const categoriesList = [
    'Beauty & Personal Care',
    'Fashion',
    'Accessories',
    'Home & Lifestyle'
  ];

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (brand) params.append('brand', brand);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sort) params.append('sort', sort);
      if (inStock) params.append('inStock', 'true');
      if (searchParams.get('bestSeller')) params.append('bestSeller', 'true');
      if (searchParams.get('featured')) params.append('featured', 'true');
      if (searchParams.get('newArrival')) params.append('newArrival', 'true');
      params.append('page', page);
      params.append('limit', 12);

      const res = await API.get(`/products?${params.toString()}`);
      if (res.data.success) {
        setProducts(res.data.data);
        setTotalPages(res.data.pages);
        setTotalCount(res.data.total);
      }
    } catch (error) {
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  }, [search, category, brand, minPrice, maxPrice, sort, inStock, page, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync URL search params
  const applyFilters = () => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (brand) params.brand = brand;

    let minP = minPrice ? Number(minPrice) : null;
    let maxP = maxPrice ? Number(maxPrice) : null;

    if (minP !== null && maxP !== null && minP > maxP) {
      minP = null;
      setMinPrice('');
    }

    if (minP !== null) params.minPrice = minP;
    if (maxP !== null) params.maxPrice = maxP;

    if (sort) params.sort = sort;
    if (inStock) params.inStock = 'true';
    params.page = 1;
    setPage(1);
    setSearchParams(params);
    setMobileFilterOpen(false);
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSort('popular');
    setInStock(false);
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-100 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">All Products</h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <strong className="text-slate-800">{totalCount}</strong> items available in DM-GLOWCART store
          </p>

          {/* Quick Budget Deal Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Quick Deals:</span>
            <button
              onClick={() => { setMinPrice(''); setMaxPrice('20'); setSearchParams({ maxPrice: '20' }); }}
              className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
                maxPrice === '20' ? 'bg-glow-600 text-white shadow-sm' : 'bg-rose-100 text-glow-700 hover:bg-rose-200'
              }`}
            >
              ⚡ Under ₹20 Deals
            </button>
            <button
              onClick={() => { setMinPrice(''); setMaxPrice('500'); setSearchParams({ maxPrice: '500' }); }}
              className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
                maxPrice === '500' ? 'bg-glow-600 text-white shadow-sm' : 'bg-rose-50 text-slate-700 hover:bg-rose-100'
              }`}
            >
              💎 Under ₹500
            </button>
            <button
              onClick={resetFilters}
              className="px-3 py-1 rounded-full text-xs font-bold shrink-0 bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              All Items
            </button>
          </div>
        </div>

        {/* Top Controls: Mobile Filter Button & Sorting */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 bg-white border border-rose-200 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-glow-600" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setSearchParams((prev) => {
                  prev.set('sort', e.target.value);
                  return prev;
                });
              }}
              className="bg-white border border-rose-200 text-xs font-semibold text-slate-800 rounded-xl px-3 py-2 outline-none focus:border-glow-500 shadow-sm"
            >
              <option value="popular">Popularity & Rating</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-rose-100 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Filter className="w-4 h-4 text-glow-600" />
              <span>Filter Products</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-[11px] font-semibold text-glow-600 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search filter input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Search Keyword</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, brand or keyword..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:border-glow-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
            <div className="space-y-1">
              <button
                onClick={() => setCategory('')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  category === '' ? 'bg-glow-50 text-glow-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    category === cat ? 'bg-glow-50 text-glow-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Price Range (₹)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min ₹"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-glow-500"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max ₹"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-glow-500"
              />
            </div>
          </div>

          {/* In Stock toggle */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <input
              type="checkbox"
              id="inStockCheck"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-4 h-4 text-glow-600 rounded border-slate-300 focus:ring-glow-500"
            />
            <label htmlFor="inStockCheck" className="text-xs font-medium text-slate-700 cursor-pointer">
              In Stock Only
            </label>
          </div>

          <button
            onClick={applyFilters}
            className="w-full bg-glow-600 hover:bg-glow-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-glow transition-all duration-200"
          >
            Apply Filters
          </button>
        </aside>

        {/* Main Product Grid */}
        <main className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No products matched your criteria"
              description="Try adjusting your filters or search keyword to find what you are looking for."
              actionText="Reset All Filters"
              actionLink="/shop"
            />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8 border-t border-slate-100">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="p-2 rounded-xl border border-rose-200 text-slate-600 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <span className="text-xs font-bold text-slate-700 px-4">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="p-2 rounded-xl border border-rose-200 text-slate-600 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Drawer Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-bold text-slate-900">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 border rounded-xl p-2 text-xs"
                >
                  <option value="">All Categories</option>
                  {categoriesList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold">Max Price (₹)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full mt-1 border rounded-xl p-2 text-xs"
                />
              </div>

              <button
                onClick={applyFilters}
                className="w-full bg-glow-600 text-white font-bold text-xs py-3 rounded-xl shadow-glow"
              >
                Apply & View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
