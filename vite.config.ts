import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@src': resolve(__dirname, './src'),
            '@assets': resolve(__dirname, './src/assets'),
            '@components': resolve(__dirname, './src/components'),
            '@pages': resolve(__dirname, './src/pages'),
            '@uitls': resolve(__dirname, './src/uitls'),
            '@config': resolve(__dirname, './src/config'),
        },
    },
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: '',
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/api/, ''),
            },
        },
        hmr: {
            overlay: false,
        },
    },
});
