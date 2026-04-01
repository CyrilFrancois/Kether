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
    console.error("🔍 ERROR DIAGNOSTICS:", data);
    if (!data) return err.message || "Network Connection Error";
    if (Array.isArray(data.detail)) return `${data.detail[0].loc[1] || 'Field'}: ${data.detail[0].msg}`;
    if (typeof data.detail === 'string') return data.detail;
    return JSON.stringify(data.detail) || "Server rejected the request.";
  };

  const finalizeAuthentication = (user, token) => {
    console.log("🛠️ STEP 3 [SYNC]: Injecting token into persistence...");
    localStorage.setItem('kether_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    loginStore(user, token);
    console.log("✅ STEP 5 [SYNC]: Handshake complete.");
  };

  const register = async (email, password, fullName) => {
    setIsLoading(true);
    setError(null);
    // Registration usually accepts JSON
    const payload = { email, password, fullName };
    console.log("🚀 STEP 1 [START]: Sending Registration...", payload);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, payload);
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

    /**
     * STRATEGY: FORM-DATA ENCODING
     * Many FastAPI backends use OAuth2PasswordRequestForm which 
     * REQUIRES 'application/x-www-form-urlencoded' content type.
     */
    const formData = new URLSearchParams();
    formData.append('username', email); // Mapping your email to the required 'username' key
    formData.append('password', password);

    console.log("🚀 STEP 1 [START]: Attempting Login via Form Data...");

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

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