import type { QueryMutation } from './_shared.js';

export type AdapterScrobbleResponse = null;

export type AdapterScrobbleRequest = QueryMutation<AdapterScrobbleQuery, AdapterScrobbleBody>;

export interface AdapterScrobbleQuery {
    id: string;
}

export interface AdapterScrobbleBody {
    event?: 'pause' | 'unpause' | 'timeupdate' | 'start';
    position?: number;
    submission: boolean;
}
