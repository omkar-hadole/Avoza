import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { ProductCard } from '../components/ui/ProductCard';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, fetchProducts, loading } = useProductStore();

  const categoryFilter = searchParams.get('category');
  const searchFilter = searchParams.get('search');

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (products.length > 0) {
      let result = [...products];

      if (categoryFilter) {
        result = result.filter((p) =>
          p.category.toLowerCase().includes(categoryFilter.toLowerCase())
        );
      }

      if (searchFilter) {
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
            p.description.toLowerCase().includes(searchFilter.toLowerCase())
        );
      }

      setFilteredProducts(result);
    }
  }, [products, categoryFilter, searchFilter]);

  const categories = ['All', 'Bags', 'Apparel', 'Home Accent', 'Accessories'];

  const handleCategoryChange = (cat) => {
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-black uppercase tracking-widest mb-4">
          {categoryFilter ? `${categoryFilter} Collection` : 'All Products'}
        </h1>
        <div className="w-16 h-px bg-black mx-auto"></div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-28">
            <h3 className="text-sm font-semibold tracking-widest uppercase mb-6 text-black border-b border-gray-200 pb-4">
              Categories
            </h3>
            <ul className="space-y-4">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryChange(cat)}
                    className={`text-sm tracking-wide hover:text-black transition-colors ${
                      categoryFilter === cat || (!categoryFilter && cat === 'All')
                        ? 'text-black font-medium'
                        : 'text-gray-500'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-playfair text-gray-500 mb-4">No products found</h3>
              <p className="text-gray-400">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
