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
            // Only auto-logout on 401 for protected API routes, NOT for auth endpoints
            const url = error.config?.url || '';
            const isAuthEndpoint = url.includes('/auth/') && !url.includes('/auth/profile');
            if (error.response?.status === 401 && !isAuthEndpoint) {
              get().logout();
              window.location.reload();
            }
            return Promise.reject(error);
          }
        );
      },

      // Authentication
      signup: async (username, password) => {
        set({ isLoading: true });
        try {
          const res = await axios.post('/auth/signup', { username, password });
          if (res.data.requiresVerification) {
            set({ isLoading: false });
            return { requiresVerification: true, email: res.data.email };
          }
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.message || 'Registration failed' };
        }
      },

      login: async (username, password) => {
        set({ isLoading: true });
        try {
          const res = await axios.post('/auth/login', { username, password });
          if (res.data.requiresVerification) {
            set({ isLoading: false });
            return { requiresVerification: true, email: res.data.email };
          }
          const { user, access_token } = res.data;
          set({ user, token: access_token, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
      },

      verifyOtp: async (email, code) => {
        set({ isLoading: true });
        try {
          const res = await axios.post('/auth/verify-otp', { email, code });
          const { user, access_token } = res.data;
          set({ user, token: access_token, isLoading: false });
          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      requestPasswordReset: async (email) => {
        set({ isLoading: true });
        try {
          await axios.post('/auth/forgot-password', { email });
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.message || 'Request failed' };
        }
      },

      submitPasswordReset: async (email, code, newPassword) => {
        set({ isLoading: true });
        try {
          await axios.post('/auth/reset-password', { email, code, newPassword });
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      updateProfile: async (name, dp) => {
        set({ isLoading: true });
        try {
          const { token } = get();
          const res = await axios.patch('/auth/profile', { name, dp }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ user: res.data.user, token: res.data.access_token, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.message || 'Failed to update profile' };
        }
      },

      uploadFile: async (file) => {
        set({ isLoading: true });
        try {
          const { token } = get();
          const formData = new FormData();
          formData.append('file', file);
          const res = await axios.post('/uploads', formData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          set({ isLoading: false });
          return { success: true, url: res.data.url };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'File upload failed' };
        }
      },

      enrollInCourse: async (courseId) => {
        set({ isLoading: true });
        try {
          const { token } = get();
          const res = await axios.post(`/courses/${courseId}/enroll`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // After enrollment, we should probably refresh the user profile to get new enrolledCourseIds
          // For now, let's manually update the local user object if success
          if (res.data.success) {
            const user = get().user;
            const enrolledCourseIds = [...(user.enrolledCourseIds || []), courseId];
            set({ user: { ...user, enrolledCourseIds }, isLoading: false });
          }
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Enrollment failed' };
        }
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
