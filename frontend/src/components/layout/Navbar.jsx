import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'Collections', path: '/collections' },
    { name: 'About', path: '/about' },
  ];

  const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const wishlistItemCount = wishlist?.items?.length || 0;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-black focus:outline-none">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center md:justify-start flex-1 md:flex-none">
            <Link to="/" className="text-2xl font-playfair font-bold tracking-widest text-black">
              AVOZA.
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-sm font-medium text-gray-600 hover:text-black uppercase tracking-wider transition-colors duration-200">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Link to={user ? "/profile" : "/login"} className="text-gray-600 hover:text-black transition-colors duration-200">
              <User size={20} />
            </Link>
            
            <Link to="/wishlist" className="relative text-gray-600 hover:text-black transition-colors duration-200 hidden sm:block">
              <Heart size={20} />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="relative text-gray-600 hover:text-black transition-colors duration-200">
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-3 text-base font-medium text-gray-900 border-b border-gray-50 uppercase tracking-widest"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-3 text-base font-medium text-red-600 uppercase tracking-widest"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
