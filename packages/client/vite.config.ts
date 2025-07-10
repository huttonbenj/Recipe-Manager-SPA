import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { API_CONFIG } from '@recipe-manager/shared';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: API_CONFIG.BASE_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    sourcemap: true,
  },
}); 