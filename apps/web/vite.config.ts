/* eslint-env node */

import type { UserConfig } from 'vite';
import { join } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { chrome } from '../electron/.electron-vendors.cache.json';

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');

const config: UserConfig = {
    mode: process.env.MODE,
    root: PACKAGE_ROOT,
    envDir: PROJECT_ROOT,
    resolve: {
        alias: {
            '/@/': `${join(PACKAGE_ROOT, 'src')}/`,
        },
    },
    base: '',
    server: {
        fs: {
            strict: true,
        },
    },
    build: {
        sourcemap: true,
        target: `chrome${chrome}`,
        outDir: 'dist',
        assetsDir: '.',
        rollupOptions: {
            input: join(PACKAGE_ROOT, 'index.html'),
        },
        emptyOutDir: true,
        reportCompressedSize: false,
    },
    plugins: [
        react(),
        tsconfigPaths(),
        tailwindcss(),
    ],
};

export default config;
