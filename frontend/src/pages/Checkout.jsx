import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Plus, CheckCircle2, CreditCard, Lock, ArrowRight, AlertCircle, QrCode, Copy, Check, Sparkles, Upload } from 'lucide-react';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ImageWithFallback from '../components/ImageWithFallback';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart, cartSubtotal } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const passedData = location.state || {};
  const appliedCoupon = passedData.appliedCoupon || null;
  const discountAmount = passedData.discountAmount || 0;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Payment Options & UPI QR State
  const [paymentMethodType, setPaymentMethodType] = useState('UPI_QR'); // 'UPI_QR' or 'RAZORPAY'
  const [upiId, setUpiId] = useState('monisha20070711@okicici');
  const [customQrUrl, setCustomQrUrl] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // New Address Form State
  const [fullName, setFullName] = useState(user ? user.name : '');
  const [phone, setPhone] = useState(user ? user.phone : '');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');

  const items = cart.items || [];
  const netSubtotal = Math.max(0, cartSubtotal - discountAmount);
  const deliveryCharge = netSubtotal >= 499 || items.length === 0 ? 0 : 49;
  const grandTotal = netSubtotal + deliveryCharge;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const res = await API.get('/addresses');
        if (res.data.success) {
          setAddresses(res.data.data);
          const defaultAddr = res.data.data.find((a) => a.isDefault) || res.data.data[0];
          if (defaultAddr) setSelectedAddress(defaultAddr);
        }
      } catch (err) {
        console.error('Fetch addresses error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pinRegex.test(pincode)) {
      showToast('Please enter a valid 6-digit Indian PIN code', 'error');
      return;
    }

    try {
      const res = await API.post('/addresses', {
        fullName,
        phone,
        addressLine,
        city,
        state,
        pincode,
        landmark,
        isDefault: addresses.length === 0
      });

      if (res.data.success) {
        showToast('Address saved successfully!', 'success');
        setAddresses([...addresses, res.data.data]);
        setSelectedAddress(res.data.data);
        setShowAddressModal(false);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save address';
      showToast(msg, 'error');
    }
  };

  // Process Razorpay Test Payment Flow
  const handlePayment = async () => {
    if (!selectedAddress) {
      showToast('Please select or add a delivery address', 'error');
      return;
    }

    if (items.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    try {
      setProcessingPayment(true);

      // 1. Create Razorpay order on backend (computes actual prices from MongoDB)
      const res = await API.post('/payment/create-order', {
        items,
        couponCode: appliedCoupon ? appliedCoupon.code : ''
      });

      if (!res.data.success) {
        showToast(res.data.message || 'Failed to initiate order', 'error');
        setProcessingPayment(false);
        return;
      }

      const { razorpayOrderId, amountInPaise, keyId, verifiedItems } = res.data.data;

      // 2. Razorpay Checkout Handler Verification
      const verifyPaymentOnBackend = async (paymentResponse) => {
        try {
          const verifyRes = await API.post('/payment/verify', {
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            shippingAddress: selectedAddress,
            items: verifiedItems,
            couponCode: appliedCoupon ? appliedCoupon.code : '',
            subtotal: cartSubtotal,
            discount: discountAmount,
            deliveryCharge,
            grandTotal
          });

          if (verifyRes.data.success) {
            clearCart();
            showToast('Payment successful! Order confirmed.', 'success');
            navigate('/order-success', { state: { order: verifyRes.data.data } });
          } else {
            showToast('Payment verification failed on server.', 'error');
          }
        } catch (err) {
          console.error('Verification Error:', err);
          showToast('Payment signature verification failed.', 'error');
        } finally {
          setProcessingPayment(false);
        }
      };

      // 3. Trigger Razorpay JS Modal if available
      if (window.Razorpay) {
        const options = {
          key: keyId,
          amount: amountInPaise,
          currency: 'INR',
          name: 'DM-GLOWCART',
          description: 'Everyday Essentials - Order Payment',
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100',
          order_id: razorpayOrderId,
          handler: function (response) {
            verifyPaymentOnBackend(response);
          },
          prefill: {
            name: selectedAddress.fullName || user.name,
            email: user.email,
            contact: selectedAddress.phone || user.phone
          },
          theme: {
            color: '#e11d48'
          },
          modal: {
            ondismiss: function () {
              setProcessingPayment(false);
              showToast('Payment cancelled by user', 'info');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Direct Test Simulator fallback if Razorpay JS script blocked
        setTimeout(() => {
          verifyPaymentOnBackend({
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: `pay_test_${Date.now()}`,
            razorpay_signature: 'simulated_test_signature'
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Payment Error:', error);
      showToast(error.response?.data?.message || 'Payment initiation failed', 'error');
      setProcessingPayment(false);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    showToast('UPI ID copied to clipboard!', 'success');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleUpiPayment = async () => {
    if (!selectedAddress) {
      showToast('Please select or add a delivery address', 'error');
      return;
    }
    if (!utrNumber || utrNumber.trim().length < 6) {
      showToast('Please enter a valid 12-digit UTR/Reference Number from GPay/PhonePe', 'error');
      return;
    }

    try {
      setProcessingPayment(true);
      const res = await API.post('/payment/create-upi-order', {
        items,
        couponCode: appliedCoupon ? appliedCoupon.code : '',
        shippingAddress: selectedAddress,
        utrNumber: utrNumber.trim(),
        subtotal: cartSubtotal,
        discount: discountAmount,
        deliveryCharge,
        grandTotal
      });

      if (res.data.success) {
        clearCart();
        showToast('UPI Payment submitted! Order confirmed.', 'success');
        navigate('/order-success', { state: { order: res.data.data } });
      } else {
        showToast(res.data.message || 'Failed to submit UPI order', 'error');
      }
    } catch (err) {
      console.error('UPI Submit Error:', err);
      showToast(err.response?.data?.message || 'UPI Order submission failed', 'error');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glow-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Secure Checkout</h1>
        <p className="text-xs text-slate-500 mt-1">Complete your order with Razorpay Test Mode gateway</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Address Selection & Order Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <MapPin className="w-5 h-5 text-glow-600" />
                <span>1. Select Delivery Address</span>
              </div>

              <button
                onClick={() => setShowAddressModal(true)}
                className="text-xs font-bold text-glow-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add New Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-rose-200 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-3">No saved addresses found. Please add an address to continue checkout.</p>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="bg-glow-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow"
                >
                  Add Address Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAddress && selectedAddress._id === addr._id
                        ? 'border-glow-600 bg-rose-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-800">{addr.fullName}</span>
                      {selectedAddress && selectedAddress._id === addr._id && (
                        <CheckCircle2 className="w-4 h-4 text-glow-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Order Items Summary */}
          <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900">2. Order Items ({items.length})</h3>
            <div className="divide-y divide-slate-100">
              {items.map((item) => {
                const p = item.product;
                if (!p) return null;
                return (
                  <div key={p._id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <ImageWithFallback
                        src={p.images && p.images[0]}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-lg shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-slate-800 block">{p.name}</span>
                        <span className="text-slate-400 text-[11px]">Qty: {item.quantity} × ₹{p.price}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">₹{p.price * item.quantity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Payment & Order Totals */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm space-y-5">
            <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Choose Payment Method
            </h3>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setPaymentMethodType('UPI_QR')}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  paymentMethodType === 'UPI_QR'
                    ? 'bg-white text-glow-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-4 h-4 text-glow-600" />
                <span>UPI QR Scanner</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethodType('RAZORPAY')}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  paymentMethodType === 'RAZORPAY'
                    ? 'bg-white text-glow-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4 text-glow-600" />
                <span>Razorpay Gateway</span>
              </button>
            </div>

            {/* TAB 1: UPI QR SCANNER OPTION */}
            {paymentMethodType === 'UPI_QR' && (
              <div className="space-y-4 pt-1">
                <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 p-4 rounded-2xl border border-rose-200 text-center space-y-3">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-glow-700 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" /> Scan & Pay via GPay / PhonePe / Paytm
                  </div>

                  {/* QR Image Display */}
                  <div className="bg-white p-3 rounded-2xl inline-block border border-rose-200 shadow-sm relative group">
                    <img
                      src={
                        customQrUrl ||
                        `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                          `upi://pay?pa=${upiId}&pn=DM-GLOWCART&am=${grandTotal}&cu=INR`
                        )}`
                      }
                      alt="UPI Payment QR Code"
                      className="w-44 h-44 object-contain mx-auto rounded-lg"
                    />
                    <div className="text-[10px] text-slate-500 mt-1 font-semibold">
                      Scan with any UPI App • Pay ₹{grandTotal}
                    </div>
                  </div>

                  {/* UPI ID & Copy button */}
                  <div className="bg-white p-2.5 rounded-xl border border-rose-200 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-700 font-bold truncate">{upiId}</span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="bg-rose-100 hover:bg-rose-200 text-glow-700 text-[11px] font-sans font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0"
                    >
                      {copiedUpi ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
                    </button>
                  </div>

                  {/* Custom Scanner URL Toggle / Custom QR Option */}
                  <details className="text-left">
                    <summary className="text-[11px] text-slate-500 font-semibold cursor-pointer hover:text-glow-600">
                      ⚙️ Change UPI ID or Image Link
                    </summary>
                    <div className="mt-2 space-y-2 pt-2 border-t border-rose-200 text-[11px]">
                      <div>
                        <label className="font-bold text-slate-700">UPI ID / VPA:</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full mt-0.5 p-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          placeholder="yourname@okicici"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700">Custom QR Image URL (Optional):</label>
                        <input
                          type="text"
                          value={customQrUrl}
                          onChange={(e) => setCustomQrUrl(e.target.value)}
                          className="w-full mt-0.5 p-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          placeholder="https://i.imgur.com/your-qr.png"
                        />
                      </div>
                    </div>
                  </details>
                </div>

                {/* UTR Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Enter 12-Digit UTR / Ref No (After Payment): <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 328409182391"
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs outline-none focus:border-glow-600 font-mono tracking-wider"
                  />
                  <p className="text-[10px] text-slate-400">
                    Find the 12-digit UTR/UPI Ref No in your GPay / PhonePe payment receipt.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleUpiPayment}
                  disabled={processingPayment || !selectedAddress || !utrNumber}
                  className="w-full bg-gradient-to-r from-glow-600 to-rose-600 hover:from-glow-700 hover:to-rose-700 text-white font-bold text-sm py-4 rounded-2xl shadow-glow transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  <span>{processingPayment ? 'Confirming Order...' : `VERIFY & SUBMIT UPI ORDER (₹${grandTotal})`}</span>
                </button>
              </div>
            )}

            {/* TAB 2: RAZORPAY GATEWAY OPTION */}
            {paymentMethodType === 'RAZORPAY' && (
              <div className="space-y-4 pt-1">
                <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-glow-600 text-white flex items-center justify-center font-bold shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900">Razorpay Test Gateway</span>
                    <span className="text-[11px] text-slate-500">Supports Cards, Netbanking & Online UPI</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={processingPayment || !selectedAddress}
                  className="w-full bg-gradient-to-r from-glow-600 to-rose-600 hover:from-glow-700 hover:to-rose-700 text-white font-bold text-sm py-4 rounded-2xl shadow-glow transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  <span>{processingPayment ? 'Processing Gateway...' : `PAY ₹${grandTotal} VIA RAZORPAY`}</span>
                </button>
              </div>
            )}

            {/* Order Price Summary */}
            <div className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold text-slate-900">
                  {deliveryCharge === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryCharge}`}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total Payable</span>
              <span className="text-xl font-bold text-glow-600">₹{grandTotal}</span>
            </div>

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL Encrypted Secure Checkout
            </p>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-slate-900">Add Delivery Address</h3>

            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full mt-1 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-glow-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-1 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-glow-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Address (House No, Street)</label>
                <textarea
                  rows="2"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full mt-1 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-glow-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full mt-1 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-glow-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">6-Digit PIN Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 641601"
                    className="w-full mt-1 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-glow-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full mt-1 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-glow-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-glow-600 hover:bg-glow-700 text-white font-bold py-2.5 rounded-xl shadow-glow"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
