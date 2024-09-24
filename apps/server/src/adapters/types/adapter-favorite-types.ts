import type { QueryMutation } from '@/adapters/types/shared-types.js';

export type AdapterSetFavoriteResponse = null;

export type AdapterSetFavoriteQuery = null;

export type AdapterSetFavoriteBody = {
    entry: {
        favorite: boolean;
        id: string;
        type: 'album' | 'artist' | 'track';
    }[];
};

export type AdapterSetFavoriteRequest = QueryMutation<
    AdapterSetFavoriteQuery,
    AdapterSetFavoriteBody
>;
