import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { useProductStore } from '../store/useProductStore';

const Home = () => {
  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2667&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6 uppercase tracking-wider"
          >
            The Art of Minimalism
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 mb-10 font-light max-w-2xl"
          >
            Discover our curated collection of premium essentials. Elevated design for the modern lifestyle.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <Link to="/products">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 uppercase tracking-widest font-semibold px-12">
                Shop Collection
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section id="collections" className="py-24 bg-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-playfair font-bold text-black uppercase tracking-widest mb-4">Curated Categories</h2>
          <div className="w-16 h-px bg-black mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Apparel', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2572&auto=format&fit=crop' },
            { title: 'Bags & Accessories', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2600&auto=format&fit=crop' },
            { title: 'Home Accents', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=2574&auto=format&fit=crop' },
          ].map((cat, idx) => (
            <Link to={`/products?category=${cat.title.split(' ')[0]}`} key={idx} className="group relative h-[400px] overflow-hidden bg-gray-100">
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <h3 className="text-white text-2xl font-playfair font-semibold tracking-widest uppercase">{cat.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-beige px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-playfair font-bold text-black uppercase tracking-widest mb-4">Featured Additions</h2>
              <div className="w-16 h-px bg-black"></div>
            </div>
            <Link to="/products" className="hidden sm:inline-flex items-center text-sm font-semibold tracking-widest uppercase hover:text-gray-600 transition-colors border-b border-black pb-1">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <Link to={`/products/${product._id}`} key={product._id} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-white mb-4">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-black mb-1 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Brand Value prop */}
      <section id="about" className="py-32 bg-white text-center px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-playfair font-bold text-black uppercase tracking-widest mb-8">Our Philosophy</h2>
        <p className="text-lg text-gray-600 leading-relaxed font-light">
          We believe in the power of simplicity. Every piece in our collection is thoughtfully curated to provide exceptional quality, timeless aesthetics, and enduring value. By distilling design to its essence, we create room for what truly matters.
        </p>
      </section>
    </div>
  );
};

export default Home;
