import type { QueryMutation } from '@/adapters/types/shared-types.js';

export type SetRatingResponse = null;

export type SetRatingQuery = null;

export type SetRatingBody = {
    entry: {
        id: string;
        rating: number;
        type: 'album' | 'artist' | 'song';
    }[];
};

export type SetRatingRequest = QueryMutation<SetRatingQuery, SetRatingBody>;
