import { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      // 1. Extract data from backend response
      const { user, access_token } = response.data;

      // 2. Persist token to LocalStorage (so refreshing doesn't log you out)
      localStorage.setItem('kether_token', access_token);
      
      // 3. Set Default Axios Header for all future calls
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // 4. Update Zustand Store
      loginStore(user, access_token);
      
      return true; // Tells the component to navigate
    } catch (err) {
      const message = err.response?.data?.detail || "Connection to Kether failed.";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, fullName) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        fullName
      });

      const { user, access_token } = response.data;
      
      localStorage.setItem('kether_token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
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
    localStorage.removeItem('kether_token');
    delete axios.defaults.headers.common['Authorization'];
    logoutStore();
  };

  return { login, register, logout, isLoading, error };
};

export default useAuth;