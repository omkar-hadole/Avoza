import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';

const getAuthHeaders = () => {
  const { user } = useAuthStore.getState();
  if (user && user.token) {
    return { headers: { Authorization: `Bearer ${user.token}` } };
  }
  return {};
};

export const useWishlistStore = create((set, get) => ({
  wishlist: { items: [] },
  loading: false,
  error: null,
  fetchWishlist: async () => {
    const headers = getAuthHeaders();
    if (!headers.headers) return; // Not logged in
    
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get('/api/wishlist', headers);
      set({ wishlist: data, loading: false });
    } catch (error) {
      set({
        error: error.response && error.response.data.message ? error.response.data.message : error.message,
        loading: false,
      });
    }
  },
  toggleWishlist: async (productId) => {
    const headers = getAuthHeaders();
    if (!headers.headers) return; // Not logged in
    
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(`/api/wishlist/${productId}`, {}, headers);
      set({ wishlist: data, loading: false });
    } catch (error) {
      set({
        error: error.response && error.response.data.message ? error.response.data.message : error.message,
        loading: false,
      });
    }
  },
  clearWishlist: () => set({ wishlist: { items: [] }, error: null, loading: false }),
}));
