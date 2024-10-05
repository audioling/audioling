import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import eslint from 'vite-plugin-eslint2';
import path from 'node:path';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    plugins: [
        TanStackRouterVite(),
        react(),
        eslint({
            emitErrorAsWarning: true,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    clearScreen: false,
    css: {
        modules: {
            generateScopedName: '[name]_[local]_[hash:base64:5]',
            localsConvention: 'camelCase' as const,
        },
    },
    server: {
        port: 1420,
        strictPort: true,
        host: host || false,
        hmr: host
            ? {
                  protocol: 'ws',
                  host,
                  port: 1421,
              }
            : undefined,
        watch: {
            // 3. tell vite to ignore watching `src-tauri`
            ignored: ['**/src-tauri/**'],
        },
    },
}));
