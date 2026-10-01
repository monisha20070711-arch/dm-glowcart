import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import API from '../services/api';
import EmptyState from '../components/EmptyState';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await API.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Fetch orders error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glow-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EmptyState
          icon={Package}
          title="No Orders Placed Yet"
          description="You haven't placed any orders with DM-GLOWCART so far. Start exploring our beauty catalog!"
          actionText="Shop Now"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">My Orders</h1>
        <p className="text-xs text-slate-500 mt-1">View your order history and live delivery tracking status</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-3xl border border-rose-100 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block">Order ID</span>
                <span className="font-bold text-sm text-slate-900">{order.orderId}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Date</span>
                <span className="text-xs font-semibold text-slate-700">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Total</span>
                <span className="font-bold text-sm text-glow-600">₹{order.grandTotal}</span>
              </div>
              <div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  order.orderStatus === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-700'
                    : order.orderStatus === 'Cancelled'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Product Items snippet */}
            <div className="flex flex-wrap items-center gap-4">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl pr-4">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block line-clamp-1">{item.name}</span>
                    <span className="text-[11px] text-slate-400">Qty: {item.quantity} × ₹{item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer action */}
            <div className="flex justify-end pt-2">
              <Link
                to={`/orders/${order._id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-glow-600 hover:text-glow-700 bg-rose-50 px-4 py-2 rounded-xl hover:bg-rose-100 transition-colors"
              >
                <span>Track & Order Details</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
