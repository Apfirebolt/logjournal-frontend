import { create } from 'zustand';
import httpClient from '@/lib/api';
import Cookie from 'js-cookie';
import axios from 'axios';

// Helper to get authorization headers from cookies
const getAuthHeaders = () => {
  const token = Cookie.get('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  initializeAuth: () => {
    const userCookie = Cookie.get('user');
    const token = Cookie.get('token');
    if (userCookie && token) {
      try {
        const parsedUser = JSON.parse(userCookie);
        set({ user: parsedUser, isAuthenticated: true });
      } catch (err) {
        console.error("Failed to parse user cookie:", err);
        get().logout();
      }
    }
  },

  // Google Login action matching your FastAPI backend format
  googleLogin: async (credential) => {
    set({ loading: true, error: null });
    try {
      // Your FastAPI backend expects { "token": credential }
      const res = await httpClient.post('/auth/google', { token: credential });
      const data = res.data; // Expected: { access_token, token_type, user }

      // Save tokens and user info in cookies (matching your preferred naming convention)
      Cookie.set('token', data.access_token, { expires: 7 });
      Cookie.set('user', JSON.stringify(data.user), { expires: 7 });

      set({ user: data.user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || "Google authentication failed.";
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await httpClient.post('/auth/login', credentials);
      const data = res.data; // Expected: { access_token, token_type, user }

      const token = data.access_token;
      const user = data.user;

      // Set cookies
      Cookie.set('token', token, { expires: 7 });
      Cookie.set('user', JSON.stringify(user), { expires: 7 });

      set({ user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (detail?.[0]?.msg || err.message || "Invalid email or password.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // Register action (matches FastAPI /api/auth/register)
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      await httpClient.post('/auth/register', userData);

      const loginRes = await httpClient.post('/auth/login', {
        email: userData.email,
        password: userData.password,
      });

      const data = loginRes.data;
      const token = data.access_token;
      const user = data.user;

      Cookie.set('token', token, { expires: 7 });
      Cookie.set('user', JSON.stringify(user), { expires: 7 });

      set({ user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (detail?.[0]?.msg || err.message || "Registration failed.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const res = await httpClient.get('/auth/profile', getAuthHeaders());
      const userData = res.data; // Expected DisplayAccount object
      
      Cookie.set('user', JSON.stringify(userData), { expires: 7 });
      set({ user: userData, isAuthenticated: true, loading: false });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      set({ error: "Failed to load user profile.", loading: false });
    }
  },

  // Update user profile details (username, first_name, last_name)
  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const res = await httpClient.put('/auth/profile', profileData, getAuthHeaders());
      const updatedUser = res.data;

      Cookie.set('user', JSON.stringify(updatedUser), { expires: 7 });
      set({ user: updatedUser, loading: false });
      return { success: true, user: updatedUser };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (err.message || "Failed to update profile.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // Change password action
  changePassword: async (passwordData) => {
    set({ loading: true, error: null });
    try {
      await httpClient.put('/auth/change-password', passwordData, getAuthHeaders());
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (err.message || "Failed to change password.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // Upload profile avatar image
  uploadAvatar: async (file) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await httpClient.post('/auth/upload-avatar', formData, {
        headers: {
          ...getAuthHeaders().headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUser = res.data;
      Cookie.set('user', JSON.stringify(updatedUser), { expires: 7 });
      set({ user: updatedUser, loading: false });
      return { success: true, user: updatedUser };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (err.message || "Failed to upload profile image.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // Logout action
  logout: () => {
    Cookie.remove('token');
    Cookie.remove('user');
    set({ user: null, isAuthenticated: false, error: null });
  }
}));