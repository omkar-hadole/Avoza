import { create } from 'zustand';
import axios from 'axios';

export const useProductStore = create((set) => ({
  products: [],
  product: null,
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get('/api/products');
      set({ products: data, loading: false });
    } catch (error) {
      set({
        error:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        loading: false,
      });
    }
  },
  fetchProductDetails: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      set({ product: data, loading: false });
    } catch (error) {
      set({
        error:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        loading: false,
      });
    }
  },
}));
