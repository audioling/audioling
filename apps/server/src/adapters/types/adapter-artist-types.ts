import type {
    AlbumListSortOptions,
    ArtistListSortOptions,
    ListSortOrder,
    TrackListSortOptions,
} from '@repo/shared-types';
import type { AdapterAlbumListResponse } from '@/adapters/types/adapter-album-types.js';
import type { AdapterRelatedGenre } from '@/adapters/types/adapter-genre-types.js';
import type { AdapterTrackListResponse } from '@/adapters/types/adapter-track-types.js';
import type { PaginatedResponse, QueryRequest } from '@/adapters/types/shared-types.js';

export interface AdapterArtist {
    albumCount: number | null;
    biography: string | null;
    createdDate: string | null;
    duration: number | null;
    external: {
        musicBrainzId?: string;
    };
    genres: AdapterRelatedGenre[];
    id: string;
    imageUrl: string;
    name: string;
    songCount: number | null;
    updatedDate: string | null;
    userFavorite: boolean;
    userFavoriteDate: string | null;
    userLastPlayedDate: string | null;
    userRating: number | null;
    userRatingDate: string | null;
}

export interface AdapterRelatedArtist {
    id: string;
    imageUrl: string | null;
    name: string;
}

export interface AdapterRelatedAlbumArtist {
    id: string;
    imageUrl: string | null;
    name: string;
}

export type AdapterArtistListResponse = PaginatedResponse<AdapterArtist>;

export type AdapterArtistListQuery = {
    folderId?: string[];
    limit: number;
    offset: number;
    searchTerm?: string;
    sortBy: ArtistListSortOptions;
    sortOrder: ListSortOrder;
};

export type AdapterArtistListRequest = QueryRequest<AdapterArtistListQuery>;

export type AdapterArtistListCountQuery = Omit<
    AdapterArtistListQuery,
    'sortBy' | 'sortOrder' | 'limit' | 'offset'
>;

export type AdapterArtistListCountRequest = QueryRequest<AdapterArtistListCountQuery>;

export type AdapterArtistListCountResponse = number;

export type AdapterArtistDetailQuery = {
    id: string;
};

export type AdapterArtistDetailRequest = QueryRequest<AdapterArtistDetailQuery>;

export type AdapterArtistDetailResponse = AdapterArtist;

export type AdapterArtistTrackListQuery = {
    folderId?: string[];
    id: string;
    limit: number;
    offset: number;
    sortBy: TrackListSortOptions;
    sortOrder: ListSortOrder;
};

export type AdapterArtistTrackListRequest = QueryRequest<AdapterArtistTrackListQuery>;

export type AdapterArtistTrackListResponse = AdapterTrackListResponse;

export type AdapterArtistAlbumListQuery = {
    folderId?: string[];
    id: string;
    limit: number;
    offset: number;
    sortBy: AlbumListSortOptions;
    sortOrder: ListSortOrder;
};

export type AdapterArtistAlbumListRequest = QueryRequest<AdapterArtistAlbumListQuery>;

export type AdapterArtistAlbumListResponse = AdapterAlbumListResponse;
