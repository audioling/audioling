import { join } from 'node:path';
import dts from 'vite-plugin-dts';
import { chrome } from '../electron/.electron-vendors.cache.json';

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');

const config = {
    build: {
        assetsDir: '.',
        emptyOutDir: true,
        lib: {
            entry: ['src/index.ts', 'src/ipc-main.ts'],
            formats: ['cjs'],
        },
        minify: process.env.MODE !== 'development',
        outDir: 'dist',
        reportCompressedSize: false,
        rollupOptions: {
            external: ['electron'],
            output: {
                // ESM preload scripts must have the .mjs extension
                // https://www.electronjs.org/docs/latest/tutorial/esm#esm-preload-scripts-must-have-the-mjs-extension
                entryFileNames: '[name].cjs',
            },
        },
        sourcemap: 'inline',
        ssr: true,
        target: `chrome${chrome}`,
    },
    envDir: PROJECT_ROOT,
    mode: process.env.MODE,

    plugins: [dts()],
    root: PACKAGE_ROOT,
};

export default config;
