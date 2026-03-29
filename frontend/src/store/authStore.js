import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Auth Store (Zustand)
 * Role: Global State Management for Identity.
 * Features: Persistence (localStorage) so the session survives refreshes.
 */
const useAuthStore = create(
  persist(
    (set) => ({
      // --- State ---
      token: null,
      user: null,
      isAuthenticated: false,

      // --- Actions ---
      
      /**
       * Updates the session token and flips the auth flag.
       * @param {string} token - The JWT or Access Key from the backend.
       */
      setToken: (token) => set({ 
        token, 
        isAuthenticated: !!token 
      }),

      /**
       * Updates the user profile data.
       * @param {Object} user - { id, name, role }
       */
      setUser: (user) => set({ user }),

      /**
       * Clears all session data (Logout).
       */
      clearAuth: () => set({ 
        token: null, 
        user: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'kether-auth-storage', // Unique key in LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;