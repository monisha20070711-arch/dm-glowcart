const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  image: String,
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String
    },
    paymentMethod: {
      type: String,
      default: 'Razorpay'
    },
    paymentDetails: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
      }
    },
    subtotal: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    deliveryCharge: {
      type: Number,
      default: 0
    },
    grandTotal: {
      type: Number,
      required: true
    },
    couponCode: {
      type: String,
      default: ''
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    statusTimeline: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now
        },
        message: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
