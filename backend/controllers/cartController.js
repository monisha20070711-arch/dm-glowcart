const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name brand category price originalPrice discount stock images SKU'
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Filter out items where product may have been deleted
    cart.items = cart.items.filter((item) => item.product !== null);

    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough stock available' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

      if (itemIndex > -1) {
        const newQty = cart.items[itemIndex].quantity + quantity;
        if (product.stock < newQty) {
          return res.status(400).json({ success: false, message: `Cannot add more. Only ${product.stock} units available.` });
        }
        cart.items[itemIndex].quantity = newQty;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name brand category price originalPrice discount stock images SKU'
    });

    res.json({ success: true, data: updatedCart, message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (product && product.stock < quantity) {
      return res.status(400).json({ success: false, message: `Stock limit reached (${product.stock} available)` });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();

      const updatedCart = await Cart.findById(cart._id).populate({
        path: 'items.product',
        select: 'name brand category price originalPrice discount stock images SKU'
      });

      res.json({ success: true, data: updatedCart });
    } else {
      res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/item/:productId
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
      await cart.save();

      const updatedCart = await Cart.findById(cart._id).populate({
        path: 'items.product',
        select: 'name brand category price originalPrice discount stock images SKU'
      });

      res.json({ success: true, data: updatedCart, message: 'Item removed from cart' });
    } else {
      res.status(404).json({ success: false, message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear user cart
// @route   DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
};
