import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('avoza_user')) || null,
  loading: false,
  error: null,
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('avoza_user', JSON.stringify(data));
      set({ user: data, loading: false });
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
  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      localStorage.setItem('avoza_user', JSON.stringify(data));
      set({ user: data, loading: false });
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
  logout: () => {
    localStorage.removeItem('avoza_user');
    set({ user: null });
  },
}));
