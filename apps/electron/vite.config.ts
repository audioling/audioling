import type { UserConfig } from 'vite';
import { join } from 'node:path';
import { node } from './.electron-vendors.cache.json';

const PACKAGE_ROOT = __dirname;
// const PROJECT_ROOT = join(PACKAGE_ROOT, '../..')

const config: UserConfig = {
    build: {
        assetsDir: '.',
        lib: {
            entry: {
                index: join(PACKAGE_ROOT, 'src/index.ts'),
            },
            formats: ['cjs'],
        },
        sourcemap: false,
        emptyOutDir: true,
        ssr: true,
        target: `node${node}`,
        minify: process.env.MODE !== 'development',
        outDir: 'dist-vite',
        reportCompressedSize: false,
        rollupOptions: {
            output: {
                chunkFileNames: '[name].cjs',
                entryFileNames: '[name].cjs',
            },
        },
    },
    envDir: PACKAGE_ROOT,
    resolve: {
        alias: {
            '/@/': `${join(PACKAGE_ROOT, 'src')}/`,
        },
    },
    root: PACKAGE_ROOT,
};

export default config;
