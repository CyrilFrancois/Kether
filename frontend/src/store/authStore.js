import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Auth Store (Zustand)
 * Role: Global State Management for Identity & Session Persistence.
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // --- State ---
      token: null,
      user: null,
      isAuthenticated: false,
      isInitialized: false, // Tracks if we've finished checking the local storage

      // --- Actions ---

      /**
       * Primary Login Success Handler.
       * Sets the JWT and the User object simultaneously.
       */
      login: (userData, accessToken) => {
        set({
          token: accessToken,
          user: userData,
          isAuthenticated: true,
        });
      },

      /**
       * Updates the User profile without touching the token.
       * Useful for after email verification or profile updates.
       */
      setUser: (user) => set({ user }),

      /**
       * The 'Nuke' Option: Standard Logout logic.
       * Clears everything from State and LocalStorage.
       */
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
        // Optional: Add a redirect to '/' here if using window.location
      },

      /**
       * Helper to check if a session is likely still valid.
       */
      checkAuth: () => {
        const { token, user } = get();
        return !!(token && user);
      }
    }),
    {
      name: 'kether-identity-storage', // The key in browser LocalStorage
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields (security best practice)
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;