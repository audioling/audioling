import type {
    AlbumListSortOptions,
    ArtistListSortOptions,
    ListSortOrder,
    TrackListSortOptions,
} from '../app/_app-types.js';
import type { PaginatedResponse, QueryRequest } from './_shared.js';
import type { AdapterAlbumListResponse } from './adapter-album.js';
import type { AdapterRelatedGenre } from './adapter-genre.js';
import type { AdapterTrackListResponse } from './adapter-track.js';

export interface AdapterArtist {
    albumCount: number | null;
    biography: string | null;
    createdDate: string | null;
    duration: number | null;
    genres: AdapterRelatedGenre[];
    id: string;
    imageUrl: string;
    musicBrainzId: string | null;
    name: string;
    trackCount: number | null;
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

export interface AdapterArtistListQuery {
    folderId?: string[];
    limit: number;
    offset: number;
    searchTerm?: string;
    sortBy: ArtistListSortOptions;
    sortOrder: ListSortOrder;
}

export type AdapterArtistListRequest = QueryRequest<AdapterArtistListQuery>;

export type AdapterArtistListCountQuery = Omit<
    AdapterArtistListQuery,
    'sortBy' | 'sortOrder' | 'limit' | 'offset'
>;

export type AdapterArtistListCountRequest = QueryRequest<AdapterArtistListCountQuery>;

export type AdapterArtistListCountResponse = number;

export interface AdapterArtistDetailQuery {
    id: string;
}

export type AdapterArtistDetailRequest = QueryRequest<AdapterArtistDetailQuery>;

export type AdapterArtistDetailResponse = AdapterArtist;

export interface AdapterArtistTrackListQuery {
    folderId?: string[];
    id: string;
    limit: number;
    offset: number;
    sortBy: TrackListSortOptions;
    sortOrder: ListSortOrder;
}

export type AdapterArtistTrackListRequest = QueryRequest<AdapterArtistTrackListQuery>;

export type AdapterArtistTrackListResponse = AdapterTrackListResponse;

export interface AdapterArtistTrackListCountQuery {
    id: string;
}

export interface AdapterArtistAlbumListQuery {
    folderId?: string[];
    id: string;
    limit: number;
    offset: number;
    sortBy: AlbumListSortOptions;
    sortOrder: ListSortOrder;
}

export type AdapterArtistAlbumListRequest = QueryRequest<AdapterArtistAlbumListQuery>;

export type AdapterArtistAlbumListResponse = AdapterAlbumListResponse;

export interface AdapterArtistAlbumListCountQuery {
    id: string;
}

export type AdapterArtistAlbumListCountRequest = QueryRequest<AdapterArtistAlbumListCountQuery>;

export type AdapterArtistAlbumListCountResponse = number;

export interface AdapterArtistTrackListCountQuery {
    id: string;
}

export type AdapterArtistTrackListCountRequest = QueryRequest<AdapterArtistTrackListCountQuery>;

export type AdapterArtistTrackListCountResponse = number;
