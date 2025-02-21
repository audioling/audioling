#!/usr/bin/env node

import type { ChildProcess } from 'node:child_process';
import type { LogLevel, ViteDevServer } from 'vite';
import { spawn } from 'node:child_process';
import path from 'node:path';
import electronPath from 'electron';
import { build, createServer } from 'vite';

/** @type 'production' | 'development'' */
const mode = (process.env.MODE = process.env.MODE || 'development');

const logLevel: LogLevel = 'warn';

const argv = process.argv.slice(2);
// Parse command line arguments
const args = argv.reduce((acc, arg) => {
    const [key, value] = arg.split('=');
    acc[key] = value;
    return acc;
}, {} as Record<string, string>);

/**
 * Set up a listener for the `main` package
 * Completely restart the electron app when a file changes.
 * @param {import('vite').ViteDevServer} watchServer The renderer listener server instance
 * Need to set the `VITE_DEV_SERVER_URL` environment variable from {@link import('vite').ViteDevServer.resolvedUrls}
 */
function setupMainPackageWatcher({ resolvedUrls }: ViteDevServer) {
    process.env.VITE_DEV_SERVER_URL = resolvedUrls?.local[0];

    let electronApp: ChildProcess | null = null;

    return build({
        mode,
        logLevel,
        configFile: 'apps/electron/vite.config.ts',
        build: {
            /**
             * Set to {} to enable rollup listener
             * @see https://vitejs.dev/config/build-options.html#build-watch
             */
            watch: Reflect.has(args, '--watch') ? {} : null,
        },
        plugins: [
            {
                name: 'reload-app-on-main-package-change',
                writeBundle() {
                    /** If the process already exists, kill electron */
                    if (electronApp !== null) {
                        electronApp.removeListener('exit', process.exit);
                        electronApp.kill('SIGINT');
                        electronApp = null;
                    }

                    console.log('Reloading electron app...', String(electronPath));
                    /** Start a new electron process */
                    electronApp = spawn(String(electronPath), ['--inspect', '.'], {
                        // Set the working directory
                        cwd: path.resolve(__dirname, '../apps/electron'),
                    });

                    electronApp.stdout?.on('data', (data) => {
                        console.log(data.toString());
                    });

                    electronApp.stderr?.on('data', (data) => {
                        const str = data.toString();
                        const ignoreErrors = ['Secure coding is not enabled for restorable state', 'CoreText note: Client requested name'];
                        if (ignoreErrors.some(err => str.includes(err))) {
                            return;
                        }
                        console.log('\x1B[31m%s\x1B[0m', str);
                    });

                    /** When the application exits, stop listening to the script */
                    electronApp.addListener('exit', process.exit);
                },
            },
        ],
    });
}

/**
 * Set up a listener for the `preload` package
 * Reload the web page when a file changes.
 * @param {import('vite').ViteDevServer} watchServer The renderer listener server instance
 * The web socket that needs to access the page. Reload the web page by sending a `full-reload` command to the socket.
 */
function setupPreloadPackageWatcher({ ws }: ViteDevServer) {
    return build({
        mode,
        logLevel,
        configFile: 'apps/preload/vite.config.ts',
        build: {
            /**
             * Set to {} to enable rollup listener
             * @see https://vitejs.dev/config/build-options.html#build-watch
             */
            watch: {},
        },
        plugins: [
            {
                name: 'reload-page-on-preload-package-change',
                writeBundle() {
                    ws.send({
                        type: 'full-reload',
                    });
                },
            },
        ],
    });
}

/**
 * The renderer package's development server must be started first
 * Because {@link setupMainPackageWatcher} and {@link setupPreloadPackageWatcher}
 * Depend on the properties of the development server
 */
(async () => {
    const rendererWatchServer = await createServer({
        mode,
        logLevel,
        configFile: 'apps/web/vite.config.ts',
    }).then(s => s.listen());

    await setupPreloadPackageWatcher(rendererWatchServer);
    await setupMainPackageWatcher(rendererWatchServer);
})();
