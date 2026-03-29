import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite Configuration for Kether
 * Role: Build pipeline and API Proxy Orchestration.
 */
export default defineConfig({
  plugins: [react()],
  
  server: {
    // Port 3000 is our standard frontend entry
    port: 3000,
    // Host must be true for Docker port mapping to work correctly
    host: true,
    
    // Proxy logic: Redirects all /api calls to the FastAPI backend
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        // This ensures WebSockets (for Live Agent Stream) can pass through
        ws: true, 
      },
    },
  },

  // Build optimization for production
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
});