import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const collections = [
  {
    title: 'The Essentials',
    description:
      'Foundational pieces for the minimalist wardrobe and home. Crafted for longevity and everyday elegance.',
    image:
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2572&auto=format&fit=crop',
    link: '/products?category=Apparel',
  },
  {
    title: 'Modern Accents',
    description:
      'Elevate your space with our curated selection of architectural lighting, ceramics, and soft furnishings.',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2664&auto=format&fit=crop',
    link: '/products?category=Home',
  },
  {
    title: 'Travel Core',
    description:
      'Leather goods and accessories designed for seamlessly navigating the world in refined style.',
    image:
      'https://images.unsplash.com/photo-1491336477066-31156b5e4f35?q=80&w=2670&auto=format&fit=crop',
    link: '/products?category=Bags',
  },
];

const Collections = () => {
  return (
    <div className="w-full bg-white pt-12 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-playfair font-bold text-black uppercase tracking-widest mb-6"
        >
          Curated Collections
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-16 h-px bg-black mx-auto mb-6"
        ></motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto text-gray-500 font-light text-lg"
        >
          Discover our edit of premium categories, thoughtfully organized to help you find precisely
          what you're looking for.
        </motion.p>
      </div>

      <div className="flex flex-col">
        {collections.map((collection, index) => (
          <div
            key={collection.title}
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} min-h-[60vh]`}
          >
            {/* Image Side */}
            <div className="w-full md:w-1/2 relative overflow-hidden group">
              <img
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />
            </div>

            {/* Text Side */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-12 md:p-24 bg-beige/30">
              <div className="max-w-md text-center md:text-left">
                <span className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4 block">
                  Collection {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-black uppercase tracking-wider mb-6">
                  {collection.title}
                </h2>
                <p className="text-gray-600 font-light leading-relaxed mb-10 text-lg">
                  {collection.description}
                </p>
                <Link
                  to={collection.link}
                  className="inline-flex items-center text-sm font-semibold tracking-widest uppercase hover:text-gray-500 transition-colors border-b border-black hover:border-gray-500 pb-1"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;
