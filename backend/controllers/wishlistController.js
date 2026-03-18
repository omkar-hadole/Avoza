import Wishlist from '../models/Wishlist.js';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.product');
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] });
  }
  res.json(wishlist);
};

// @desc    Toggle item in wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
export const toggleWishlist = async (req, res) => {
  const { productId } = req.params;

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] });
  }

  const itemIndex = wishlist.items.findIndex((item) => item.product.toString() === productId);

  if (itemIndex > -1) {
    // Remove if exists
    wishlist.items.splice(itemIndex, 1);
  } else {
    // Add if doesn't exist
    wishlist.items.push({ product: productId });
  }

  await wishlist.save();
  const updatedWishlist = await Wishlist.findById(wishlist._id).populate('items.product');
  res.status(200).json(updatedWishlist);
};
