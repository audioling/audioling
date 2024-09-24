import { homedir, platform } from 'os';
import { join } from 'path';

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
        // Who knows, maybe its win64?
        return getForWindows();
    }
    return getForLinux();
}

export function getAppDataPath(app: string) {
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
