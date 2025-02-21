import type { ElectronAPI } from '@repo/electron-preload';

declare global {
    // eslint-disable-next-line
  var electronAPI: ElectronAPI
}
