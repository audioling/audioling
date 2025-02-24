/**
 * @module preload
 */

import type { MainMessage, RenderMessage } from './types/';
import { contextBridge } from 'electron';
import { IPCRenderer } from './ipc-renderer';

export * from './types/';

const ipcRenderer = new IPCRenderer<RenderMessage, MainMessage>();

const electronAPI = {
    on: ipcRenderer.on,
    send: ipcRenderer.send,
    versions: process.versions,
} as const;

export type ElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
