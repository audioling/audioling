import type { QueryMutation } from './_shared.js';

export type AdapterSetFavoriteResponse = null;

export type AdapterSetFavoriteQuery = null;

export interface AdapterSetFavoriteBody {
    entry: {
        favorite: boolean;
        id: string;
        type: 'album' | 'artist' | 'track';
    }[];
}

export type AdapterSetFavoriteRequest = QueryMutation<
    AdapterSetFavoriteQuery,
    AdapterSetFavoriteBody
>;
