import type { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types';
import type { AdapterRelatedAlbumArtist } from '@/adapters/types/adapter-artist-types.js';
import type { AdapterRelatedGenre } from '@/adapters/types/adapter-genre-types.js';
import type { PaginatedResponse, QueryRequest } from '@/adapters/types/shared-types.js';

export interface AdapterAlbum {
    albumArtists: AdapterRelatedAlbumArtist[];
    comment: string | null;
    createdAt: string;
    duration: number | null;
    external: {
        musicbrainz: {
            id: string | null;
            name: string | null;
        };
    };
    genres: AdapterRelatedGenre[];
    id: string;
    imageUrl: string | null;
    isCompilation: boolean | null;
    isFavorite: boolean;
    lastPlayedAt: string | null;
    name: string;
    playCount: number | null;
    releaseDate: string;
    releaseYear: number;
    size: number | null;
    songCount: number | null;
    updatedAt: string;
    userRating: number | null;
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
