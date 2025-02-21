import { app } from 'electron';

/** 是否处于开发环境 */
export const isDev = import.meta.env.DEV;
/** 是否处于生产环境 */
export const isProd = import.meta.env.PROD;
/** 是否处于打包状态 */
export const isPackaged = app.isPackaged;

export const isMac = process.platform === 'darwin';
export const isWindows = process.platform === 'win32';
