import { create } from 'zustand';
import httpClient from '@/lib/api';
import Cookie from 'js-cookie';

// Helper to get authorization headers from cookies
const getAuthHeaders = () => {
  const token = Cookie.get('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,
  error: null,

  // 1. Fetch all notifications for the authenticated user
  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const res = await httpClient.get('/notifications/', getAuthHeaders());
      set({ notifications: res.data, loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (detail?.[0]?.msg || err.message || "Failed to fetch notifications.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // 2. Mark a specific notification as read by ID
  markAsRead: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await httpClient.patch(`/notifications/${id}/read`, {}, getAuthHeaders());
      const updatedNotification = res.data;

      // Update in local state notifications list
      set((state) => ({
        notifications: state.notifications.map((n) => (n.id === Number(id) ? updatedNotification : n)),
        loading: false,
      }));

      return { success: true, data: updatedNotification };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (detail?.[0]?.msg || err.message || "Failed to mark notification as read.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // 3. Delete a notification by ID
  deleteNotification: async (id) => {
    set({ loading: true, error: null });
    try {
      await httpClient.delete(`/notifications/${id}`, getAuthHeaders());

      // Remove from local state notifications list
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== Number(id)),
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (detail?.[0]?.msg || err.message || "Failed to delete notification.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // Clear any active error state
  clearError: () => set({ error: null }),
}));