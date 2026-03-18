import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useAuthStore } from '../../store/useAuthStore';

export const ProductCard = ({ product }) => {
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  
  const inWishlist = wishlist?.items?.some(item => item.product._id === product._id || item.product === product._id);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to add to wishlist');
      return;
    }
    toggleWishlist(product._id);
  };

  return (
    <Link to={`/products/${product._id}`} className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-4">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <button 
          onClick={handleWishlist}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm text-black hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <Heart size={18} className={inWishlist ? "fill-black text-black" : "text-black"} />
        </button>
      </div>
      <h3 className="text-base font-medium text-black mb-1 truncate group-hover:underline decoration-1 underline-offset-4">{product.name}</h3>
      <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
    </Link>
  );
};
