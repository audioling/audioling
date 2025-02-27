/* eslint-env node */

import type { UserConfig } from 'vite';
import { join } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { chrome } from '../electron/.electron-vendors.cache.json';

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');

const config: UserConfig = {
    base: '',
    build: {
        assetsDir: '.',
        emptyOutDir: true,
        outDir: 'dist',
        reportCompressedSize: false,
        rollupOptions: {
            input: join(PACKAGE_ROOT, 'index.html'),
        },
        sourcemap: true,
        target: `chrome${chrome}`,
    },
    envDir: PROJECT_ROOT,
    mode: process.env.MODE,
    plugins: [
        react(),
        tsconfigPaths(),
    ],
    resolve: {
        alias: {
            '/@/': `${join(PACKAGE_ROOT, 'src')}/`,
        },
    },
    root: PACKAGE_ROOT,
    server: {
        fs: {
            strict: true,
        },
    },
};

export default config;
