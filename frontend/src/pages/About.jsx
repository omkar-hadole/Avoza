import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2669&auto=format&fit=crop" 
            alt="About Background" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-playfair font-bold text-white uppercase tracking-widest"
          >
            Our Philosophy
          </motion.h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-px bg-black mx-auto mb-10"></div>
        <h2 className="text-2xl font-playfair font-semibold tracking-wider text-black uppercase mb-8">
          The Art of Reduction
        </h2>
        <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed">
          <p>
            At Avoza, we believe that true luxury lies in simplicity. Founded on the principle of reduction, we strip away the unnecessary to focus on what truly matters: exceptional materials, timeless silhouettes, and uncompromising craftsmanship.
          </p>
          <p>
            In a world of constant visual noise, we offer an sanctuary of minimalist design. Every object in our collection is curated not to demand attention, but to quietly elevate your daily rituals.
          </p>
          <p>
            We partner with artisans and manufacturers who share our dedication to quality over quantity. By prioritizing sustainable practices and enduring designs, our pieces are created to be cherished across seasons and generations.
          </p>
        </div>
      </section>

      {/* Visual Break */}
      <section className="h-[70vh] w-full mt-10">
        <img 
          src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?q=80&w=2671&auto=format&fit=crop" 
          alt="Studio Detail" 
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
        />
      </section>

      {/* Commitment Section */}
      <section className="bg-beige py-24 mb-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row gap-12 text-center md:text-left">
          <div className="w-full md:w-1/2">
            <h3 className="text-xl font-playfair font-bold uppercase tracking-widest text-black mb-4">Material Integrity</h3>
            <p className="text-gray-600 font-light">We source globally, selecting only materials that offer both tactile beauty and lasting durability—from Italian full-grain leathers to Mongolian cashmere.</p>
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-xl font-playfair font-bold uppercase tracking-widest text-black mb-4">Ethical Creation</h3>
            <p className="text-gray-600 font-light">Transparency is fundamental. We ensure fair wages and safe working conditions across our tight-knit network of production studios.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
