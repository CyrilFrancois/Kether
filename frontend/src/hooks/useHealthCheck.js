import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * useHealthCheck Hook
 * Role: Environment Monitor - Pings the backend to verify system readiness.
 * Returns: status object { backend: 'online'|'checking'|'error', ai: 'online'|'checking'|'error' }
 */
export const useHealthCheck = (intervalMs = 5000) => {
  const [status, setStatus] = useState({
    backend: 'checking',
    ai: 'checking',
  });

  const checkSystem = useCallback(async () => {
    try {
      // 1. Ping the Backend Health Endpoint
      // Note: We expect the backend to have a GET /health route
      const response = await axios.get('http://localhost:8000/health', {
        timeout: 3000 // Don't wait forever
      });

      // 2. Map the response to our UI states
      // Assuming backend returns: { status: "ok", ai_status: "ready" }
      setStatus({
        backend: response.status === 200 ? 'online' : 'error',
        ai: response.data?.ai_status === 'ready' ? 'online' : 'error'
      });
    } catch (err) {
      // 3. If the request fails, the Engine is likely offline/restarting
      setStatus({
        backend: 'error',
        ai: 'error'
      });
      console.warn("⚠️ Kether Engine unreachable. Retrying...");
    }
  }, []);

  useEffect(() => {
    // Initial check on mount
    checkSystem();

    // Set up the heartbeat interval
    const heartbeat = setInterval(checkSystem, intervalMs);

    // Cleanup when the component unmounts
    return () => clearInterval(heartbeat);
  }, [checkSystem, intervalMs]);

  return {
    status,
    checkNow: checkSystem,
    isSystemReady: status.backend === 'online' && status.ai === 'online'
  };
};

export default useHealthCheck;