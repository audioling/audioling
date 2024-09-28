import type { LibraryFeatures } from '@repo/shared-types';
import type { BaseEndpointArgs } from '@/adapters/types/shared-types.js';

export type AdapterServerInfoRequest = BaseEndpointArgs;

export type AdapterServerInfo = {
    features: LibraryFeatures;
    id?: string;
    version: string;
};

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
