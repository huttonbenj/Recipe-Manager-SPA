import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
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