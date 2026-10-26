import { create } from 'zustand';
import httpClient from '@/lib/api';
import Cookie from 'js-cookie';

// Helper to get authorization headers from cookies
const getAuthHeaders = () => {
  const token = Cookie.get('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const useJournalStore = create((set, get) => ({
  entries: [],
  currentEntry: null,
  categories: [],
  loading: false,
  error: null,

  // 1. Fetch all journal entries for the authenticated user
  fetchEntries: async () => {
    set({ loading: true, error: null });
    try {
      const res = await httpClient.get('/journal/entries', getAuthHeaders());
      set({ entries: res.data, loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (detail?.[0]?.msg || err.message || "Failed to fetch entries.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // 2. Fetch a single journal entry detail by ID
  fetchEntryById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await httpClient.get(`/journal/entries/${id}`, getAuthHeaders());
      set({ currentEntry: res.data, loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (detail?.[0]?.msg || err.message || "Failed to fetch entry detail.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // 3. Create a new journal entry
  // payload expects: { title, highlights, gratitude, better_day_thoughts, category_sections: [...] }
  createEntry: async (entryData) => {
    set({ loading: true, error: null });
    try {
      const res = await httpClient.post('/journal/entries', entryData, getAuthHeaders());
      const newEntry = res.data;
      
      // Prepend to current entries list
      set((state) => ({
        entries: [newEntry, ...state.entries],
        loading: false,
      }));

      return { success: true, data: newEntry };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (detail?.[0]?.msg || err.message || "Failed to create journal entry.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // 4. Fetch all available categories (system default + user custom)
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await httpClient.get('/journal/categories', getAuthHeaders());
      set({ categories: res.data, loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (detail?.[0]?.msg || err.message || "Failed to fetch categories.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // 5. Add a custom category
  // payload expects: { name: "Coding" }
  createCategory: async (categoryData) => {
    set({ loading: true, error: null });
    try {
      const res = await httpClient.post('/journal/categories', categoryData, getAuthHeaders());
      const newCategory = res.data;

      set((state) => ({
        categories: [...state.categories, newCategory],
        loading: false,
      }));

      return { success: true, data: newCategory };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (detail?.[0]?.msg || err.message || "Failed to create category.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // Clear current active entry or error state
  clearCurrentEntry: () => set({ currentEntry: null }),
  clearError: () => set({ error: null }),
}));