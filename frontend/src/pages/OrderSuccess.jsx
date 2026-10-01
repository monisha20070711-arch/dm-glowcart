import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Calendar } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Success Badge */}
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-100 animate-bounce">
        <CheckCircle2 className="w-14 h-14" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
          Payment Verified via Razorpay Test Mode
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Order Successfully Placed!
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Thank you for shopping with <strong>DM-GLOWCART</strong>. Your order is being packed and prepared for dispatch.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs text-slate-400 block">Order Reference ID</span>
            <span className="text-lg font-bold text-slate-900">{order.orderId}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Total Amount Paid</span>
            <span className="text-lg font-bold text-glow-600">₹{order.grandTotal}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-bold text-slate-800 block mb-1">Shipping Address:</span>
            <p className="text-slate-600 leading-relaxed">
              {order.shippingAddress?.fullName}<br />
              {order.shippingAddress?.addressLine}, {order.shippingAddress?.city}<br />
              {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br />
              Phone: {order.shippingAddress?.phone}
            </p>
          </div>

          <div>
            <span className="font-bold text-slate-800 block mb-1">Razorpay Transaction:</span>
            <p className="text-slate-600">
              Payment ID: <strong className="text-slate-800">{order.paymentDetails?.razorpayPaymentId}</strong><br />
              Status: <strong className="text-emerald-600 font-bold">Paid / Confirmed</strong><br />
              Payment Method: {order.paymentMethod}
            </p>
          </div>
        </div>

        {/* Itemized list */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <span className="font-bold text-xs text-slate-800 block">Items Purchased:</span>
          <div className="space-y-2">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                  <span className="font-semibold text-slate-800">{item.name} × {item.quantity}</span>
                </div>
                <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to={`/orders/${order._id}`}
          className="w-full sm:w-auto bg-glow-600 hover:bg-glow-700 text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-glow transition-all duration-200"
        >
          Track Order Details
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-8 py-3.5 rounded-xl transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
