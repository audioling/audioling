import type { QueryMutation } from '@/adapters/types/shared-types.js';

export type AdapterScrobbleResponse = null;

export type AdapterScrobbleRequest = QueryMutation<AdapterScrobbleQuery, AdapterScrobbleBody>;

export type AdapterScrobbleQuery = {
    id: string;
};

export type AdapterScrobbleBody = {
    event?: 'pause' | 'unpause' | 'timeupdate' | 'start';
    position?: number;
    submission: boolean;
};
