import type { QueryMutation } from '@/adapters/types/shared-types.js';

export type AdapterSetRatingResponse = null;

export type AdapterSetRatingQuery = null;

export type AdapterSetRatingBody = {
    entry: {
        id: string;
        rating: number;
        type: 'album' | 'artist' | 'song';
    }[];
};

export type AdapterSetRatingRequest = QueryMutation<AdapterSetRatingQuery, AdapterSetRatingBody>;
