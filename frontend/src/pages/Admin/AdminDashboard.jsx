import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, ShoppingBag, DollarSign, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import API from '../../services/api';

const COLORS = ['#e11d48', '#f59e0b', '#10b981', '#6366f1'];

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await API.get('/admin/analytics');
        if (res.data.success) {
          setAnalytics(res.data.data);
        }
      } catch (err) {
        console.error('Fetch analytics error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glow-600"></div>
      </div>
    );
  }

  const { summary, lowStockProducts, categoryStats, recentOrders } = analytics || {};

  const pieChartData = categoryStats
    ? categoryStats.map((item) => ({ name: item._id, value: item.totalRevenue }))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-glow-600">Executive Console</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products" className="bg-glow-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-glow">
            Manage Products
          </Link>
          <Link to="/admin/orders" className="bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl">
            Manage Orders
          </Link>
          <Link to="/admin/coupons" className="bg-rose-100 text-glow-700 font-bold text-xs px-4 py-2.5 rounded-xl">
            Manage Coupons
          </Link>
        </div>
      </div>

      {/* Summary Analytics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Revenue</span>
            <div className="p-2 bg-rose-50 text-glow-600 rounded-xl"><DollarSign className="w-5 h-5" /></div>
          </div>
          <span className="text-2xl font-bold text-slate-900 block">₹{summary?.totalRevenue || 0}</span>
          <span className="text-[11px] text-emerald-600 font-semibold">Verified Razorpay Payments</span>
        </div>

        <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Orders</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><ShoppingBag className="w-5 h-5" /></div>
          </div>
          <span className="text-2xl font-bold text-slate-900 block">{summary?.totalOrders || 0}</span>
          <span className="text-[11px] text-amber-600 font-semibold">{summary?.pendingOrders || 0} Pending Dispatch</span>
        </div>

        <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Products</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Package className="w-5 h-5" /></div>
          </div>
          <span className="text-2xl font-bold text-slate-900 block">{summary?.totalProducts || 0}</span>
          <span className="text-[11px] text-slate-400 font-medium">In Active Catalog</span>
        </div>

        <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Registered Users</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Users className="w-5 h-5" /></div>
          </div>
          <span className="text-2xl font-bold text-slate-900 block">{summary?.totalUsers || 0}</span>
          <span className="text-[11px] text-indigo-600 font-semibold">Active Customers</span>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales by Category Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-rose-100 p-6 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-slate-900">Revenue by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieChartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Bar dataKey="value" fill="#e11d48" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts Box */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-rose-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Low Stock Warning
            </h3>
            <span className="text-xs font-bold text-rose-600">{lowStockProducts?.length || 0} items</span>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {lowStockProducts && lowStockProducts.length > 0 ? (
              lowStockProducts.map((p) => (
                <div key={p._id} className="flex items-center justify-between p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block line-clamp-1">{p.name}</span>
                    <span className="text-slate-400">SKU: {p.SKU}</span>
                  </div>
                  <span className="font-bold text-rose-600 bg-white px-2.5 py-1 rounded-lg border border-rose-200">
                    {p.stock} left
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">All products are adequately stocked.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-slate-900">Recent Customer Orders</h3>
          <Link to="/admin/orders" className="text-xs font-bold text-glow-600 hover:underline">View All Orders</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders?.map((ord) => (
                <tr key={ord._id} className="hover:bg-rose-50/30">
                  <td className="p-3 font-bold text-slate-800">{ord.orderId}</td>
                  <td className="p-3 text-slate-600">{ord.user?.name || ord.shippingAddress?.fullName}</td>
                  <td className="p-3 font-bold text-slate-900">₹{ord.grandTotal}</td>
                  <td className="p-3">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {ord.paymentDetails?.status || 'Completed'}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-glow-600">{ord.orderStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
