import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, Package, ShieldCheck, ArrowLeft } from 'lucide-react';
import API from '../services/api';

const OrderTrack = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (err) {
        console.error('Fetch order detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glow-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Order Record Not Found</h2>
        <Link to="/orders" className="text-glow-600 font-bold hover:underline mt-4 inline-block">
          Return to My Orders
        </Link>
      </div>
    );
  }

  const timelineSteps = [
    'Pending',
    'Confirmed',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  const currentStepIndex = timelineSteps.indexOf(order.orderStatus);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link to="/orders" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-glow-600">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-glow-600">Live Order Tracking</span>
            <h1 className="text-2xl font-serif font-bold text-slate-900 mt-1">{order.orderId}</h1>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Placed on</span>
            <span className="text-xs font-bold text-slate-700">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Visual Progress Stepper */}
        <div className="py-6">
          <div className="relative flex items-center justify-between max-w-3xl mx-auto">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-glow-600 -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${(Math.max(0, currentStepIndex) / (timelineSteps.length - 1)) * 100}%` }}
            ></div>

            {timelineSteps.map((step, idx) => {
              const completed = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      completed
                        ? 'bg-glow-600 text-white shadow-md'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    } ${isCurrent ? 'ring-4 ring-rose-100 scale-110' : ''}`}
                  >
                    {completed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span className={`text-[10px] font-bold mt-2 whitespace-nowrap hidden sm:block ${
                    completed ? 'text-glow-700' : 'text-slate-400'
                  }`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping & Items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900">Delivery Address</h4>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl">
              <strong>{order.shippingAddress?.fullName}</strong><br />
              {order.shippingAddress?.addressLine}, {order.shippingAddress?.city}<br />
              {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br />
              Phone: {order.shippingAddress?.phone}
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900">Razorpay Payment Status</h4>
            <div className="bg-slate-50 p-4 rounded-2xl space-y-1 text-slate-600">
              <p>Razorpay Payment ID: <strong className="text-slate-800">{order.paymentDetails?.razorpayPaymentId}</strong></p>
              <p>Status: <strong className="text-emerald-600 font-bold">{order.paymentDetails?.status}</strong></p>
              <p>Grand Total Paid: <strong className="text-glow-600 text-sm">₹{order.grandTotal}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrack;
