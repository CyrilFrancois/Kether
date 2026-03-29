import { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

/**
 * useAuth Hook
 * Role: The logic controller for Identity and Session management.
 * Provides: login function, logout function, and loading/error states.
 */
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Connect to our global Zustand store (we'll create this next)
  const { setToken, setUser, clearAuth } = useAuthStore();

  const login = async (accessKey) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. In a real scenario, we POST to the backend
      // const response = await axios.post('http://localhost:8000/v1/auth/login', {
      //   key: accessKey
      // });
      
      // 2. For now, we simulate the "Secure Handshake"
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (accessKey === 'kether_dev_pass' || accessKey === 'admin') {
        const mockUser = { id: 1, name: 'Architect', role: 'admin' };
        const mockToken = 'kether_jwt_token_xyz_123';

        // 3. Update Global Store & LocalStorage
        setToken(mockToken);
        setUser(mockUser);
        
        return true;
      } else {
        throw new Error('Invalid Access Key. Handshake failed.');
      }
    } catch (err) {
      const message = err.response?.data?.detail || err.message;
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    // Redirect logic is handled by App.jsx observing the store
  };

  return {
    login,
    logout,
    isLoading,
    error
  };
};

export default useAuth;