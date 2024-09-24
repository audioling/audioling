import path from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
    clearScreen: false,
    css: {
        modules: {
            generateScopedName: '[name]_[local]_[hash:base64:5]',
            localsConvention: 'camelCase',
        },
    },
    plugins: [
        react(),
        eslint({
            failOnError: false,
            failOnWarning: false,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: process.env.VSCODE_DEBUG
        ? (() => {
              const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
              return {
                  host: url.hostname,
                  port: +url.port,
              };
          })()
        : {
              open: false,
              port: 5174,
          },
});
