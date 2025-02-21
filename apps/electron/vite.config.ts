import type { UserConfig } from 'vite';
import { join } from 'node:path';
import { node } from './.electron-vendors.cache.json';

const PACKAGE_ROOT = __dirname;
// const PROJECT_ROOT = join(PACKAGE_ROOT, '../..')

const config: UserConfig = {
    envDir: PACKAGE_ROOT,
    root: PACKAGE_ROOT,
    resolve: {
        alias: {
            '/@/': `${join(PACKAGE_ROOT, 'src')}/`,
        },
    },
    build: {
        ssr: true,
        sourcemap: false,
        target: `node${node}`,
        outDir: 'dist-vite',
        assetsDir: '.',
        minify: process.env.MODE !== 'development',
        lib: {
            entry: {
                index: join(PACKAGE_ROOT, 'src/index.ts'),
            },
            formats: ['cjs'],
        },
        rollupOptions: {
            output: {
                entryFileNames: '[name].cjs',
                chunkFileNames: '[name].cjs',
            },
        },
        emptyOutDir: true,
        reportCompressedSize: false,
    },
};

export default config;
