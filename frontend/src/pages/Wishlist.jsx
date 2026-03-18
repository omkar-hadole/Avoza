import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlistStore } from '../store/useWishlistStore';
import { useAuthStore } from '../store/useAuthStore';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';

const Wishlist = () => {
  const { wishlist, fetchWishlist, loading } = useWishlistStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user, fetchWishlist]);

  if (!user) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center text-center px-4">
        <h2 className="text-3xl font-playfair font-bold text-black mb-4">Your Wishlist</h2>
        <p className="text-gray-500 mb-8">Please log in to view your wishlist.</p>
        <Button onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    );
  }

  const items = wishlist?.items || [];

  if (loading && items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 className="text-3xl md:text-4xl font-playfair font-bold text-black uppercase tracking-widest mb-12 text-center md:text-left">
        Wishlist
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20 border-t border-b border-gray-100">
          <p className="text-xl text-gray-500 mb-8 uppercase tracking-widest">Your wishlist is empty.</p>
          <Link to="/products">
            <Button size="lg" className="uppercase tracking-widest">Discover Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
             item.product && <ProductCard key={item.product._id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
