import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 3000,
    host: true, // Crucial for Docker
    
    proxy: {
      // Logic: Any call starting with /api in React 
      // goes to http://backend:8000/
      '/api': {
        target: 'http://backend:8000', // FIX: Use the Docker service name
        changeOrigin: true,
        // This removes '/api' from the URL before sending it to FastAPI
        // Example: frontend fetch('/api/auth/me') -> backend GET /auth/me
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws: true, 
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild', // 'terser' requires an extra dependency, esbuild is faster/built-in
  },
});