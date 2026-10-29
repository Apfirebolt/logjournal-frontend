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
  tags: [], // Added tags state
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
  // payload expects: { title, highlights, gratitude, better_day_thoughts, category_sections: [...], tags: [...] }
  createEntry: async (entryData) => {
    set({ loading: true, error: null });
    try {
      const res = await httpClient.post('/journal/entries', entryData, getAuthHeaders());
      const newEntry = res.data;
      
      // Prepend to current entries list and refresh tags list
      set((state) => ({
        entries: [newEntry, ...state.entries],
        loading: false,
      }));
      
      // Fetch latest tags in case new ones were auto-created
      get().fetchTags();

      return { success: true, data: newEntry };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (detail?.[0]?.msg || err.message || "Failed to create journal entry.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // 4. Update an existing journal entry by ID
  updateEntry: async (id, entryData) => {
    set({ loading: true, error: null });
    try {
      const res = await httpClient.put(`/journal/entries/${id}`, entryData, getAuthHeaders());
      const updatedEntry = res.data;

      // Update in local state entries list and currentEntry
      set((state) => ({
        entries: state.entries.map((e) => (e.id === Number(id) ? updatedEntry : e)),
        currentEntry: updatedEntry,
        loading: false,
      }));

      // Refresh tags list
      get().fetchTags();

      return { success: true, data: updatedEntry };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (detail?.[0]?.msg || err.message || "Failed to update journal entry.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // 5. Delete a journal entry by ID
  deleteEntry: async (id) => {
    set({ loading: true, error: null });
    try {
      await httpClient.delete(`/journal/entries/${id}`, getAuthHeaders());

      // Remove from local state entries list and clear currentEntry if it matches
      set((state) => ({
        entries: state.entries.filter((e) => e.id !== Number(id)),
        currentEntry: state.currentEntry?.id === Number(id) ? null : state.currentEntry,
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (detail?.[0]?.msg || err.message || "Failed to delete journal entry.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // 6. Fetch all available categories (system default + user custom)
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

  // 7. Add a custom category
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

  // 8. Fetch all user tags
  fetchTags: async () => {
    try {
      const res = await httpClient.get('/journal/tags', getAuthHeaders());
      set({ tags: res.data });
      return { success: true, data: res.data };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (detail?.[0]?.msg || err.message || "Failed to fetch tags.");
      return { success: false, error: errorMsg };
    }
  },

  // Clear current active entry or error state
  clearCurrentEntry: () => set({ currentEntry: null }),
  clearError: () => set({ error: null }),
}));