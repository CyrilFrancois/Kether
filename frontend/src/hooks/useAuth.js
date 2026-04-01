import { useState } from 'react';
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
    if (!data) return err.message || "Network Error";
    if (Array.isArray(data.detail)) return `${data.detail[0].loc[1]}: ${data.detail[0].msg}`;
    if (typeof data.detail === 'string') return data.detail;
    return JSON.stringify(data.detail);
  };

  /**
   * INTERNAL HELPER: Force-injects the token into all systems 
   * BEFORE the UI has a chance to re-render.
   */
  const finalizeAuthentication = (user, token) => {
    console.log("🛠️ STEP 3 [SYNC]: Injecting token into persistence...");
    
    // 1. LocalStorage (Physical backup)
    localStorage.setItem('kether_token', token);
    
    // 2. Axios (The Network Pipe)
    // We set this EXPLICITLY before the store to ensure 
    // any immediate useEffect calls have the header ready.
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    console.log("🛠️ STEP 4 [SYNC]: Verifying Header:", axios.defaults.headers.common['Authorization']);

    // 3. Zustand (The UI Trigger)
    loginStore(user, token);
    console.log("✅ STEP 5 [SYNC]: Zustand Store Updated. Redirecting...");
  };

  const register = async (email, password, fullName) => {
    setIsLoading(true);
    setError(null);

    const payload = { email, password, full_name: fullName };
    console.log("🚀 STEP 1 [START]: Sending Registration...", payload);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, payload);
      console.log("📥 STEP 2 [SUCCESS]: Backend responded with status:", response.status);

      const { user, access_token } = response.data;

      if (!access_token || access_token.split('.').length !== 3) {
        console.error("❌ ERROR: Received malformed token from backend!", access_token);
        throw new Error("Invalid Token Segment Count");
      }

      // Synchronously finalize
      finalizeAuthentication(user, access_token);
      return true;

    } catch (err) {
      const msg = formatErrorMessage(err);
      console.error("❌ STEP 2 [FAILURE]:", msg);
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    console.log("🚀 STEP 1 [START]: Attempting Login...");

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      console.log("📥 STEP 2 [SUCCESS]: Login valid.");

      const { user, access_token } = response.data;
      finalizeAuthentication(user, access_token);
      return true;

    } catch (err) {
      const msg = formatErrorMessage(err);
      console.error("❌ STEP 2 [FAILURE]:", msg);
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log("🧹 STEP 0: Clearing Session...");
    localStorage.removeItem('kether_token');
    delete axios.defaults.headers.common['Authorization'];
    logoutStore();
  };

  return { login, register, logout, isLoading, error };
};

export default useAuth;