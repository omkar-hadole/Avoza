import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Heart, Truck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, fetchProductDetails, loading } = useProductStore();
  const { addToCart, cart } = useCartStore();
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProductDetails(id);
  }, [id, fetchProductDetails]);

  if (loading || !product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const inWishlist = wishlist?.items?.some(
    (item) => item.product._id === product._id || item.product === product._id
  );

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    await addToCart(product._id, quantity);
    setAddingToCart(false);
  };

  const handleWishlist = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    toggleWishlist(product._id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Product Images */}
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-[4/5] bg-gray-100 overflow-hidden relative"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col pt-4 md:pt-10">
          <p className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-4">
            {product.category}
          </p>
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-black mb-4">
            {product.name}
          </h1>
          <p className="text-xl text-gray-900 mb-8">${product.price.toFixed(2)}</p>

          <div className="w-12 h-px bg-gray-300 mb-8"></div>

          <p className="text-gray-600 leading-relaxed font-light mb-10">{product.description}</p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex items-center border border-gray-300 h-14 w-32 relative">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full flex items-center justify-center text-xl text-gray-500 hover:text-black transition-colors focus:outline-none"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                className="w-full h-full text-center focus:outline-none appearance-none bg-transparent"
                readOnly
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-full flex items-center justify-center text-xl text-gray-500 hover:text-black transition-colors focus:outline-none"
              >
                +
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1 h-14 uppercase tracking-widest text-sm"
              onClick={handleAddToCart}
              disabled={addingToCart || !product.inStock}
            >
              {addingToCart ? 'Adding...' : !product.inStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`h-14 w-14 shrink-0 border-gray-300 ${inWishlist ? 'border-black' : ''}`}
              onClick={handleWishlist}
            >
              <Heart className={inWishlist ? 'fill-black text-black' : 'text-gray-500'} />
            </Button>
          </div>

          {/* Perks */}
          <div className="mt-10 border-t border-gray-200 pt-8 space-y-4">
            <div className="flex items-center text-sm text-gray-600">
              <Truck size={18} className="mr-4 text-black" />
              <span>Free complementary shipping on orders over $250</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <RefreshCw size={18} className="mr-4 text-black" />
              <span>Complimentary 30-day returns & exchanges</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
