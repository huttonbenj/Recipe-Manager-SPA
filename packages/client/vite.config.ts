import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { CLIENT_CONFIG, API_CONFIG } from '@recipe-manager/shared';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    'global': 'globalThis',
  },
  server: {
    port: CLIENT_CONFIG.DEFAULT_PORT,
    proxy: {
      '/api': {
        target: API_CONFIG.BASE_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: ['@recipe-manager/shared'],
  },
  build: {
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/, /packages\/shared/],
    },
  },
}); 