import { useState, useCallback } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);

  const formatErrorMessage = (err) => {
    const data = err.response?.data;
    if (!data) return err.message || "Network Connection Error";
    if (Array.isArray(data.detail)) return `${data.detail[0].loc[1] || 'Field'}: ${data.detail[0].msg}`;
    if (typeof data.detail === 'string') return data.detail;
    return JSON.stringify(data.detail) || "Server rejected the request.";
  };

  const logout = useCallback(() => {
    console.log("🧹 Clearing Session...");
    localStorage.removeItem('kether_token');
    delete axios.defaults.headers.common['Authorization'];
    logoutStore();
  }, [logoutStore]);

  const finalizeAuthentication = (user, token) => {
    localStorage.setItem('kether_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    loginStore(user, token);
    console.log("✅ Handshake complete.");
  };

  /**
   * NEW: Session Validation Handshake
   * Checks if the stored token is actually valid against the current DB
   */
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('kether_token');
    if (!token) {
      logout();
      return false;
    }

    try {
      // Set the header for this specific check
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Call your "get current user" endpoint
      const response = await axios.get(`${API_URL}/auth/me`);
      
      // If successful, re-sync the store with the user data
      loginStore(response.data, token);
      return true;
    } catch (err) {
      console.warn("⚠️ Stale session detected (likely DB wipe). Redirecting...");
      logout();
      return false;
    }
  }, [loginStore, logout]);

  const register = async (email, password, fullName) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { email, password, fullName });
      const { user, access_token } = response.data;
      finalizeAuthentication(user, access_token);
      return true;
    } catch (err) {
      setError(formatErrorMessage(err));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      const { user, access_token } = response.data;
      finalizeAuthentication(user, access_token);
      return true;
    } catch (err) {
      setError(formatErrorMessage(err));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, register, logout, checkAuth, isLoading, error };
};

export default useAuth;