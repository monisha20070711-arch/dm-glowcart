import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, CheckCircle2 } from 'lucide-react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { showToast } = useToast();

  // Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('DM-GLOWCART Beauty');
  const [category, setCategory] = useState('Beauty & Personal Care');
  const [subcategory, setSubcategory] = useState('Makeup');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('20');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [newArrival, setNewArrival] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/products?limit=100&search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setBrand('DM-GLOWCART Beauty');
    setCategory('Beauty & Personal Care');
    setSubcategory('Makeup');
    setPrice('');
    setOriginalPrice('');
    setStock('20');
    setImageUrl('');
    setDescription('');
    setFeatured(false);
    setBestSeller(false);
    setNewArrival(false);
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingId(p._id);
    setName(p.name);
    setBrand(p.brand || 'DM-GLOWCART Beauty');
    setCategory(p.category);
    setSubcategory(p.subcategory || 'General');
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || p.price);
    setStock(p.stock);
    setImageUrl(p.images && p.images[0] ? p.images[0] : '');
    setDescription(p.description);
    setFeatured(p.featured || false);
    setBestSeller(p.bestSeller || false);
    setNewArrival(p.newArrival || false);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      brand,
      category,
      subcategory,
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      stock: Number(stock),
      images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'],
      description,
      featured,
      bestSeller,
      newArrival
    };

    try {
      if (editingId) {
        const res = await API.put(`/products/${editingId}`, payload);
        if (res.data.success) {
          showToast('Product updated successfully!', 'success');
        }
      } else {
        const res = await API.post('/products', payload);
        if (res.data.success) {
          showToast('Product created successfully!', 'success');
        }
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save product';
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product from database?')) {
      try {
        const res = await API.delete(`/products/${id}`);
        if (res.data.success) {
          showToast('Product deleted!', 'info');
          fetchProducts();
        }
      } catch (error) {
        showToast('Failed to delete product', 'error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-glow-600">Inventory Catalog</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Manage Products</h1>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-glow-600 hover:bg-glow-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product name or SKU..."
          className="w-full bg-white border border-rose-200 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-glow-500 shadow-sm"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Badges</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-rose-50/30">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images && p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                    <div>
                      <span className="font-bold text-slate-800 block">{p.name}</span>
                      <span className="text-[10px] text-slate-400">SKU: {p.SKU}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 font-semibold text-slate-600">{p.category}</td>
                <td className="p-3 font-bold text-slate-900">₹{p.price}</td>
                <td className="p-3">
                  <span className={`font-bold px-2.5 py-1 rounded-full text-[10px] ${
                    p.stock <= 5 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {p.stock} units
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {p.featured && <span className="bg-rose-100 text-glow-700 text-[9px] font-bold px-1.5 py-0.5 rounded">Featured</span>}
                    {p.bestSeller && <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Bestseller</span>}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-slate-600 hover:text-glow-600 hover:bg-rose-50 rounded-lg"
                      title="Edit Product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 border rounded-xl p-2.5 outline-none focus:border-glow-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 border rounded-xl p-2.5"
                  >
                    <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Home & Lifestyle">Home & Lifestyle</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full mt-1 border rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full mt-1 border rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">MRP Original (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full mt-1 border rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full mt-1 border rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full mt-1 border rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  rows="3"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 border rounded-xl p-2.5"
                ></textarea>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded text-glow-600" />
                  Featured
                </label>
                <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={bestSeller} onChange={(e) => setBestSeller(e.target.checked)} className="rounded text-glow-600" />
                  Bestseller
                </label>
                <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={newArrival} onChange={(e) => setNewArrival(e.target.checked)} className="rounded text-glow-600" />
                  New Arrival
                </label>
              </div>

              <div className="flex gap-3 pt-3 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 font-bold py-2.5 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 bg-glow-600 text-white font-bold py-2.5 rounded-xl shadow-glow">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
