import type { ServerFeatures } from '../app/_app-types.js';
import type { BaseEndpointArgs } from './_shared.js';

export type AdapterServerInfoRequest = BaseEndpointArgs;

export interface AdapterServerInfo {
    features: ServerFeatures;
    id?: string;
    version: string;
}

export type AdapterAuthenticationResponse = {
    auth: {
        credential: string;
        username: string;
    };
    folders: {
        id: string;
        name: string;
    }[];
} | null;
