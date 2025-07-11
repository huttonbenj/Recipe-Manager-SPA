import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@recipe-manager/shared': path.resolve(__dirname, '../shared/src'),
        },
    },
    optimizeDeps: {
        include: ['@recipe-manager/shared'],
    },
    build: {
        commonjsOptions: {
            include: [/node_modules/, /shared/],
        },
    },
}); 