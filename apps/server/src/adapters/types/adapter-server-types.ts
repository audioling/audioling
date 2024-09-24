import type { LibraryFeatures } from '@repo/shared-types';
import type { BaseEndpointArgs } from '@/adapters/types/shared-types.js';

export type ServerInfoRequest = BaseEndpointArgs;

export type ServerInfo = {
    features: LibraryFeatures;
    id?: string;
    version: string;
};

export type AuthenticationResponse = {
    auth: {
        credential: string;
        username: string;
    };
    folders: {
        id: string;
        name: string;
    }[];
} | null;
