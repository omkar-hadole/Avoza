import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';

// Helper to get auth header
const getAuthHeaders = () => {
  const { user } = useAuthStore.getState();
  if (user && user.token) {
    return { headers: { Authorization: `Bearer ${user.token}` } };
  }
  return {};
};

export const useCartStore = create((set, get) => ({
  cart: { items: [] },
  loading: false,
  error: null,
  fetchCart: async () => {
    const headers = getAuthHeaders();
    if (!headers.headers) return; // Not logged in

    set({ loading: true, error: null });
    try {
      const { data } = await axios.get('/api/cart', headers);
      set({ cart: data, loading: false });
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
  addToCart: async (productId, quantity) => {
    const headers = getAuthHeaders();
    if (!headers.headers) {
      // Local cart setup can be done here, but for now we enforce login
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data } = await axios.post('/api/cart', { productId, quantity }, headers);
      set({ cart: data, loading: false });
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
  updateCartItem: async (productId, quantity) => {
    const headers = getAuthHeaders();
    if (!headers.headers) return;

    set({ loading: true, error: null });
    try {
      const { data } = await axios.put(`/api/cart/${productId}`, { quantity }, headers);
      set({ cart: data, loading: false });
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
  removeFromCart: async (productId) => {
    const headers = getAuthHeaders();
    if (!headers.headers) return;

    set({ loading: true, error: null });
    try {
      const { data } = await axios.delete(`/api/cart/${productId}`, headers);
      set({ cart: data, loading: false });
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
  clearCart: () => set({ cart: { items: [] }, error: null, loading: false }),
}));
