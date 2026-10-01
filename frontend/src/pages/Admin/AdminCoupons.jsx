import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, X } from 'lucide-react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('');
  const [minimumOrder, setMinimumOrder] = useState('500');
  const [maximumDiscount, setMaximumDiscount] = useState('500');

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await API.get('/coupons');
      if (res.data.success) {
        setCoupons(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/coupons', {
        code,
        discountType,
        discountValue: Number(discountValue),
        minimumOrder: Number(minimumOrder),
        maximumDiscount: Number(maximumDiscount)
      });

      if (res.data.success) {
        showToast('Coupon created successfully!', 'success');
        setShowModal(false);
        setCode('');
        setDiscountValue('');
        fetchCoupons();
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create coupon';
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this coupon code?')) {
      try {
        const res = await API.delete(`/coupons/${id}`);
        if (res.data.success) {
          showToast('Coupon deleted', 'info');
          fetchCoupons();
        }
      } catch (error) {
        showToast('Failed to delete coupon', 'error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-glow-600">Promotions & Discounts</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Manage Coupons</h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-glow-600 hover:bg-glow-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b">
            <tr>
              <th className="p-3">Coupon Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Min Order</th>
              <th className="p-3">Times Used</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coupons.map((c) => (
              <tr key={c._id} className="hover:bg-rose-50/30">
                <td className="p-3 font-bold text-glow-700 uppercase">{c.code}</td>
                <td className="p-3 font-bold text-slate-900">
                  {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                </td>
                <td className="p-3 text-slate-600">₹{c.minimumOrder}</td>
                <td className="p-3 text-slate-600 font-semibold">{c.timesUsed} / {c.usageLimit}</td>
                <td className="p-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {c.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-slate-900">Create Promo Coupon</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. GLOW30"
                  className="w-full mt-1 border rounded-xl p-2.5 uppercase outline-none focus:border-glow-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full mt-1 border rounded-xl p-2.5"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full mt-1 border rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Min Order (₹)</label>
                  <input
                    type="number"
                    value={minimumOrder}
                    onChange={(e) => setMinimumOrder(e.target.value)}
                    className="w-full mt-1 border rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Max Discount (₹)</label>
                  <input
                    type="number"
                    value={maximumDiscount}
                    onChange={(e) => setMaximumDiscount(e.target.value)}
                    className="w-full mt-1 border rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 font-bold py-2.5 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 bg-glow-600 text-white font-bold py-2.5 rounded-xl shadow-glow">
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
