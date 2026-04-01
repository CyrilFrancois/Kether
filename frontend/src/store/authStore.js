import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Auth Store (Zustand)
 * Role: Global State Management for Identity & Session Persistence.
 * Fix: Added explicit localStorage syncing to prevent "Bearer undefined" race conditions.
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // --- State ---
      token: null,
      user: null,
      isAuthenticated: false,

      // --- Actions ---

      /**
       * Primary Login/Register Success Handler.
       * Fix: Validates token structure before saving to prevent JWT Decode errors.
       */
      login: (userData, accessToken) => {
        // SAFETY CHECK: Ensure we aren't saving an object or undefined
        const finalToken = typeof accessToken === 'object' ? accessToken?.access_token : accessToken;

        if (!finalToken || typeof finalToken !== 'string') {
          console.error("❌ AUTH: Invalid token received", accessToken);
          return;
        }

        // We explicitly update localStorage as a backup for Axios interceptors
        localStorage.setItem('kether_token', finalToken);

        set({
          token: finalToken,
          user: userData,
          isAuthenticated: true,
        });
      },

      setUser: (user) => set({ user }),

      /**
       * Standard Logout logic.
       */
      logout: () => {
        localStorage.removeItem('kether_token');
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      /**
       * Helper to verify token health before making requests.
       */
      checkAuth: () => {
        const { token } = get();
        // A valid JWT must have at least two dots (3 segments)
        return !!(token && token.split('.').length === 3);
      }
    }),
    {
      name: 'kether-identity-storage', 
      storage: createJSONStorage(() => localStorage),
      // Only persist the core data
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
      // Fix: Ensure state is rehydrated correctly on page refresh
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          localStorage.setItem('kether_token', state.token);
        }
      }
    }
  )
);

export default useAuthStore;