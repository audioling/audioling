import type { QueryMutation } from './_shared.js';

export type AdapterSetRatingResponse = null;

export type AdapterSetRatingQuery = null;

export interface AdapterSetRatingBody {
    entry: {
        id: string;
        rating: number;
        type: 'album' | 'artist' | 'song';
    }[];
}

export type AdapterSetRatingRequest = QueryMutation<AdapterSetRatingQuery, AdapterSetRatingBody>;
