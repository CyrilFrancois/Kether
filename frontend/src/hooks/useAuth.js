import { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

// We pull the base URL from our Vite environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Accessing the updated Zustand store actions
  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);

  /**
   * Logic: Standard Email/Password Login
   */
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      const { user, access_token } = response.data;

      // Update global state & persistence
      loginStore(user, access_token);
      return true;
    } catch (err) {
      const message = err.response?.data?.detail || "Connection to Kether failed.";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logic: Create a new Free Account
   */
  const register = async (email, password, fullName) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
        full_name: fullName
      });

      const { user, access_token } = response.data;
      
      // We log them in immediately upon registration
      loginStore(user, access_token);
      return true;
    } catch (err) {
      const message = err.response?.data?.detail || "Registration failed.";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutStore();
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error
  };
};

export default useAuth;