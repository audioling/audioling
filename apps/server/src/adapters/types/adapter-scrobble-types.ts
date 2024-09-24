import type { QueryMutation } from '@/adapters/types/shared-types.js';

export type ScrobbleResponse = null;

export type ScrobbleRequest = QueryMutation<ScrobbleQuery, ScrobbleBody>;

export type ScrobbleQuery = {
    id: string;
};

export type ScrobbleBody = {
    event?: 'pause' | 'unpause' | 'timeupdate' | 'start';
    position?: number;
    submission: boolean;
};
