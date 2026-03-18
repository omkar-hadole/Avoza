import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-3xl font-playfair font-bold tracking-widest text-white mb-6 inline-block">
              AVOZA.
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Curating minimalist elegance for the modern lifestyle. Quality craftsmanship meets timeless design.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/products" className="hover:text-white transition-colors duration-200">All Products</Link></li>
              <li><Link to="/products?category=Bags" className="hover:text-white transition-colors duration-200">Bags</Link></li>
              <li><Link to="/products?category=Home" className="hover:text-white transition-colors duration-200">Home Accent</Link></li>
              <li><Link to="/products?category=Apparel" className="hover:text-white transition-colors duration-200">Apparel</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/contact" className="hover:text-white transition-colors duration-200">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors duration-200">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors duration-200">Shipping & Returns</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Avoza. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <Link to="/cookies" className="hover:text-white transition-colors duration-200">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
