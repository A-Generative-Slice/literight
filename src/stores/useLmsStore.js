import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const isProd = window.location.hostname !== 'localhost';
const API_BASE = isProd ? '/api' : 'http://localhost:3000';

// Setup Axios defaults
axios.defaults.baseURL = API_BASE;

export const useLmsStore = create(
  persist(
    (set, get) => ({
      courses: [],
      user: null,
      token: null,
      isLoading: false,

      // Initialize Axios Interceptors
      init: () => {
        axios.interceptors.response.use(
          (response) => response,
          (error) => {
            if (error.response?.status === 401) {
              get().logout();
              window.location.reload();
            }
            return Promise.reject(error);
          }
        );
      },

      // Authentication
      login: async (username, password) => {
        set({ isLoading: true });
        try {
          const res = await axios.post('/auth/login', { username, password });
          const { user, access_token } = res.data;
          set({ user, token: access_token, isLoading: false });
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
        if (!get().courses.length) set({ isLoading: true });
        try {
          const res = await axios.get('/courses');
          set({ courses: res.data, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
        }
      },

      saveCourse: async (courseData) => {
        const { token } = get();
        try {
          const res = await axios.post('/courses', courseData, {
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
          await axios.delete(`/courses/${id}`, {
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
