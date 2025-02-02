import os, { homedir, platform } from 'os';
import path from 'path';
import { join } from 'path';

const APP_NAME = process.env.APP_NAME || 'audioling';

const APP_DIR = getAppDataPath(APP_NAME);

const LIBRARY_DIR = (libraryId: string) => path.join(APP_DIR, libraryId);

const USER_DIR = process.env.APP_USER_DIR || path.join(APP_DIR, 'user');

const CACHE_DIR = (libraryId: string) =>
    process.env.APP_CACHE_DIR || path.join(APP_DIR, libraryId, 'cache');

const IMAGE_DIR = (libraryId: string) =>
    process.env.APP_IMAGE_DIR || path.join(CACHE_DIR(libraryId), 'image', libraryId);

const TEMP_DIR = process.env.APP_TEMP_DIR || path.join(os.tmpdir(), APP_NAME);

const DEFAULT_PAGINATION_LIMIT = 500;

const ENV = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
};

const NODE_ENV = Bun.env.NODE_ENV || ENV.DEVELOPMENT;

export const CONSTANTS = {
    APP_DIR,
    APP_NAME,
    CACHE_DIR,
    DEFAULT_PAGINATION_LIMIT,
    ENV,
    IMAGE_DIR,
    LIBRARY_DIR,
    NODE_ENV,
    TEMP_DIR,
    USER_DIR,
};

function getAppDataPath(app: string) {
    function getForWindows() {
        return join(homedir(), 'AppData', 'Roaming');
    }

    function getForMac() {
        return join(homedir(), 'Library', 'Application Support');
    }

    function getForLinux() {
        return join(homedir(), '.config');
    }

    function getFallback() {
        if (platform().startsWith('win')) {
            return getForWindows();
        }
        return getForLinux();
    }

    let appDataPath = process.env['APPDATA'];

    if (appDataPath === undefined) {
        switch (platform()) {
            case 'win32':
                appDataPath = getForWindows();
                break;
            case 'darwin':
                appDataPath = getForMac();
                break;
            case 'linux':
                appDataPath = getForLinux();
                break;
            default:
                appDataPath = getFallback();
        }
    }

    if (app === undefined) {
        return appDataPath;
    }

    const normalizedAppName = appDataPath !== homedir() ? app : '.' + app;
    return join(appDataPath, normalizedAppName);
}
