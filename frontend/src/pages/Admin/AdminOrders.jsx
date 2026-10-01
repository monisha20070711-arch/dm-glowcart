import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, CheckCircle2, Package, Truck, Clock } from 'lucide-react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const res = await API.get(`/orders?${params.toString()}`);
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await API.put(`/orders/${orderId}/status`, {
        status: newStatus,
        message: `Admin updated status to ${newStatus}`
      });

      if (res.data.success) {
        showToast(res.data.message, 'success');
        fetchOrders();
      }
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-glow-600">Fulfillment Pipeline</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Manage Orders</h1>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID or Customer Name..."
            className="w-full bg-white border border-rose-200 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-glow-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-rose-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-800 outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Packed">Packed</option>
          <option value="Shipped">Shipped</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer & Address</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total Amount</th>
              <th className="p-3">Razorpay Status</th>
              <th className="p-3">Order Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((ord) => (
              <tr key={ord._id} className="hover:bg-rose-50/30">
                <td className="p-3 font-bold text-slate-800">
                  {ord.orderId}
                  <span className="block text-[10px] text-slate-400 font-normal">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="p-3">
                  <span className="font-bold text-slate-800 block">{ord.shippingAddress?.fullName || ord.user?.name}</span>
                  <span className="text-[10px] text-slate-500">{ord.shippingAddress?.city}, {ord.shippingAddress?.pincode}</span>
                </td>
                <td className="p-3 text-slate-600 font-medium">
                  {ord.items?.length} item(s)
                </td>
                <td className="p-3 font-bold text-slate-900">₹{ord.grandTotal}</td>
                <td className="p-3">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    {ord.paymentDetails?.status || 'Completed'}
                  </span>
                </td>
                <td className="p-3">
                  <select
                    value={ord.orderStatus}
                    onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                    className="bg-rose-50 border border-rose-200 text-glow-700 text-xs font-bold rounded-xl px-3 py-1.5 outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
