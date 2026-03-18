import Cart from '../models/Cart.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  res.json(cart);
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

  if (itemIndex > -1) {
    // If product exists in cart, update quantity
    cart.items[itemIndex].quantity += Number(quantity);
  } else {
    // Else, add to cart
    cart.items.push({ product: productId, quantity: Number(quantity) });
  }

  await cart.save();
  const updatedCart = await Cart.findById(cart._id).populate('items.product');
  res.status(201).json(updatedCart);
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = Number(quantity);
      await cart.save();
      const updatedCart = await Cart.findById(cart._id).populate('items.product');
      res.json(updatedCart);
    } else {
      res.status(404);
      throw new Error('Item not found in cart');
    }
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(updatedCart);
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
};
