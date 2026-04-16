import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_BASE = 'http://localhost:3000'; // In production, this can be an env var or empty string if same origin

export const useLmsStore = create(
  persist(
    (set, get) => ({
      courses: [],
      user: null,
      token: null,
      isLoading: false,

      // Authentication
      login: async (username, password) => {
        set({ isLoading: true });
        try {
          const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
          set({ user: res.data.user, token: res.data.access_token, isLoading: false });
          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      // Course Management
      fetchCourses: async () => {
        set({ isLoading: true });
        try {
          const res = await axios.get(`${API_BASE}/courses`);
          set({ courses: res.data, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
        }
      },

      saveCourse: async (courseData) => {
        const { token } = get();
        try {
          const res = await axios.post(`${API_BASE}/courses`, courseData, {
            headers: { Authorization: `Bearer ${token}` }
          });
          await get().fetchCourses();
          return res.data;
        } catch (error) {
          console.error('Failed to save course', error);
          throw error;
        }
      },

      deleteCourse: async (id) => {
        const { token } = get();
        try {
          await axios.delete(`${API_BASE}/courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          await get().fetchCourses();
        } catch (error) {
          console.error('Failed to delete course', error);
        }
      }
    }),
    {
      name: 'lms-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
