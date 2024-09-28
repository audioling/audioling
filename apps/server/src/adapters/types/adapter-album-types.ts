import type { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types';
import type { AdapterRelatedAlbumArtist } from '@/adapters/types/adapter-artist-types.js';
import type { AdapterRelatedGenre } from '@/adapters/types/adapter-genre-types.js';
import type { PaginatedResponse, QueryRequest } from '@/adapters/types/shared-types.js';

export interface AdapterAlbum {
    albumArtistId: string | null;
    albumArtists: AdapterRelatedAlbumArtist[];
    comment: string | null;
    createdDate: string;
    description: string | null;
    discTitles: {
        disc: number;
        title: string;
    }[];
    duration: number;
    external: Record<string, unknown>;
    genres: AdapterRelatedGenre[];
    id: string;
    imageUrl: string | null;
    isCompilation: boolean;
    moods: { name: string }[];
    name: string;
    originalReleaseDate: {
        day: number | null;
        month: number | null;
        year: number;
    };
    recordLabels: { name: string }[];
    releaseDate: {
        day: number | null;
        month: number | null;
        year: number;
    };
    releaseTypes: { name: string }[];
    releaseYear: number;
    size: number | null;
    songCount: number | null;
    sortName: string;
    updatedDate: string;
    userFavorite: boolean;
    userFavoriteDate: string | null;
    userLastPlayedDate: string | null;
    userPlayCount: number | null;
    userRating: number | null;
    userRatingDate: string | null;
}

export type AdapterAlbumListResponse = PaginatedResponse<AdapterAlbum>;

export type AdapterAlbumListQuery = {
    folderId?: string[];
    limit: number;
    offset: number;
    searchTerm?: string;
    sortBy: AlbumListSortOptions;
    sortOrder: ListSortOrder;
};

export type AdapterAlbumListRequest = QueryRequest<AdapterAlbumListQuery>;

export type AdapterAlbumListCountQuery = Omit<
    AdapterAlbumListQuery,
    'sortBy' | 'sortOrder' | 'limit' | 'offset'
>;

export type AdapterAlbumListCountRequest = QueryRequest<AdapterAlbumListCountQuery>;

export type AdapterAlbumListCountResponse = number;

export type AdapterAlbumDetailQuery = {
    id: string;
};

export type AdapterAlbumDetailRequest = QueryRequest<AdapterAlbumDetailQuery>;

export type AdapterAlbumDetailResponse = AdapterAlbum;
