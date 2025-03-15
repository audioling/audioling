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

    // https://github.com/electron/electron/issues/42055#issuecomment-2449365647
    // Set devtools font
    browserWindow.webContents.on('devtools-opened', () => {
        const css = `
            :root {
                --sys-color-base: var(--ref-palette-neutral100);
                --source-code-font-family: consolas !important;
                --source-code-font-size: 12px;
                --monospace-font-family: consolas !important;
                --monospace-font-size: 12px;
                --default-font-family: system-ui, sans-serif;
                --default-font-size: 12px;
                --ref-palette-neutral99: #ffffffff;
            }
            .theme-with-dark-background {
                --sys-color-base: var(--ref-palette-secondary25);
            }
            body {
                --default-font-family: system-ui,sans-serif;
            }
        `;
        browserWindow.webContents.devToolsWebContents?.executeJavaScript(`
            const overriddenStyle = document.createElement('style');
            overriddenStyle.innerHTML = '${css.replaceAll('\n', ' ')}';
            document.body.append(overriddenStyle);
            document.querySelectorAll('.platform-windows').forEach(el => el.classList.remove('platform-windows'));
            addStyleToAutoComplete();
            const observer = new MutationObserver((mutationList, observer) => {
                for (const mutation of mutationList) {
                    if (mutation.type === 'childList') {
                        for (let i = 0; i < mutation.addedNodes.length; i++) {
                            const item = mutation.addedNodes[i];
                            if (item.classList.contains('editor-tooltip-host')) {
                                addStyleToAutoComplete();
                            }
                        }
                    }
                }
            });
            observer.observe(document.body, {childList: true});
            function addStyleToAutoComplete() {
                document.querySelectorAll('.editor-tooltip-host').forEach(element => {
                    if (element.shadowRoot.querySelectorAll('[data-key="overridden-dev-tools-font"]').length === 0) {
                        const overriddenStyle = document.createElement('style');
                        overriddenStyle.setAttribute('data-key', 'overridden-dev-tools-font');
                        overriddenStyle.innerHTML = '.cm-tooltip-autocomplete ul[role=listbox] {font-family: consolas !important;}';
                        element.shadowRoot.append(overriddenStyle);
                    }
                });
            }
        `);
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
