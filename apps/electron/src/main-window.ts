import type { BrowserWindowConstructorOptions } from 'electron';
import { join } from 'node:path';
import { BrowserWindow } from 'electron';
import { isDev, isLinux, isMacOS, isPackaged, isWindows } from '/@/utils/';

async function createWindow() {
    const nativeFrameConfig: Record<string, BrowserWindowConstructorOptions> = {
        linux: {
            autoHideMenuBar: true,
            frame: true,
        },
        macOS: {
            autoHideMenuBar: true,
            frame: true,
            titleBarStyle: 'default',
            trafficLightPosition: { x: 10, y: 10 },
        },
        windows: {
            autoHideMenuBar: true,
            frame: true,
        },
    };

    const browserWindow = new BrowserWindow({
        autoHideMenuBar: true,
        frame: false,
        fullscreen: false,
        height: 900,
        minHeight: 720,
        minWidth: 480,
        show: false,
        webPreferences: {
            backgroundThrottling: false,
            contextIsolation: true,
            nodeIntegration: true,
            preload: isPackaged
                ? join(__dirname, './preload/index.cjs')
                : join(__dirname, '../../preload/dist/index.cjs'),
            // https://www.electronjs.org/docs/latest/api/webview-tag#warning
            webviewTag: false,
        },
        width: 1440,
        ...(isLinux && nativeFrameConfig.linux),
        ...(isMacOS && nativeFrameConfig.macOS),
        ...(isWindows && nativeFrameConfig.windows),
    });

    /**
     * @see https://github.com/electron/electron/issues/25012
     */
    browserWindow.on('ready-to-show', () => {
        browserWindow?.show();

        if (isDev) {
            browserWindow?.webContents.openDevTools({ mode: 'detach' });
        }
    });

    const pageUrl
    = isDev && import.meta.env.VITE_DEV_SERVER_URL !== undefined
        ? import.meta.env.VITE_DEV_SERVER_URL
        : `file://${join(__dirname, './web/index.html')}`;

    await browserWindow.loadURL(pageUrl);

    return browserWindow;
}

/**
 * Restore or create a new window
 */
export async function restoreOrCreateWindow() {
    let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

    if (window === undefined) {
        window = await createWindow();
    }

    if (window.isMinimized()) {
        window.restore();
    }

    window.focus();
}
