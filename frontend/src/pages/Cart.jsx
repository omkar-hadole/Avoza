import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Trash2 } from 'lucide-react';

const Cart = () => {
  const { cart, fetchCart, updateCartItem, removeFromCart, loading } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  if (!user) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center text-center px-4">
        <h2 className="text-3xl font-playfair font-bold text-black mb-4">Your Cart</h2>
        <p className="text-gray-500 mb-8">Please log in to view and modify your cart.</p>
        <Button onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => acc + item.quantity * (item.product?.price || 0), 0);
  const shipping = subtotal > 250 ? 0 : 15;
  const total = subtotal + shipping;

  if (loading && items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 className="text-3xl md:text-4xl font-playfair font-bold text-black uppercase tracking-widest mb-12">
        Shopping Bag
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20 border-t border-b border-gray-100">
          <p className="text-xl text-gray-500 mb-8 uppercase tracking-widest">Your bag is empty.</p>
          <Link to="/products">
            <Button size="lg" className="uppercase tracking-widest">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="border-t border-gray-200">
              {items.map((item) => (
                <div key={item.product?._id} className="flex py-8 border-b border-gray-200">
                  <div className="w-24 h-32 md:w-32 md:h-40 bg-gray-100 shrink-0">
                    <img
                      src={item.product?.images[0]}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/products/${item.product?._id}`}
                          className="text-lg font-medium text-black hover:underline underline-offset-4 decoration-1"
                        >
                          {item.product?.name}
                        </Link>
                        <p className="text-lg text-black font-medium">
                          ${(item.product?.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{item.product?.category}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border border-gray-300 h-10 w-28">
                        <button
                          onClick={() =>
                            updateCartItem(item.product?._id, Math.max(1, item.quantity - 1))
                          }
                          className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                        >
                          -
                        </button>
                        <span className="w-full h-full flex items-center justify-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItem(item.product?._id, item.quantity + 1)}
                          className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product?._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 p-2 rounded-full"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-50 p-8 rounded-sm shrink-0 sticky top-28">
              <h2 className="text-xl font-playfair font-bold text-black uppercase tracking-widest mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 border-b border-gray-200 pb-6 relative z-10">
                <div className="flex justify-between text-base text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-semibold text-black mb-8 relative z-10">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Button size="lg" className="w-full uppercase tracking-widest">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
