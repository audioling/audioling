import type { GenreListSortOptions, ListSortOrder, TrackListSortOptions } from '../app/_app-types.js';
import type { PaginatedResponse, QueryRequest } from './_shared.js';
import type { AdapterTrack } from './adapter-track.js';

export interface AdapterGenre {
    albumCount: number | null;
    id: string;
    name: string;
    trackCount: number | null;
}

export interface AdapterRelatedGenre {
    id: string;
    imageUrl: string | null;
    name: string;
}

export type AdapterGenreListResponse = PaginatedResponse<AdapterGenre>;

export interface AdapterGenreListQuery {
    folderId?: string[];
    limit: number;
    offset: number;
    searchTerm?: string;
    sortBy: GenreListSortOptions;
    sortOrder: ListSortOrder;
}

export type AdapterGenreListRequest = QueryRequest<AdapterGenreListQuery>;

export type AdapterGenreListCountQuery = Omit<
    AdapterGenreListQuery,
    'sortBy' | 'sortOrder' | 'limit' | 'offset'
>;

export type AdapterGenreListCountRequest = QueryRequest<AdapterGenreListCountQuery>;

export type AdapterGenreListCountResponse = number;

export interface AdapterGenreTrackListQuery {
    folderId?: string[];
    id: string;
    limit: number;
    offset: number;
    sortBy: TrackListSortOptions;
    sortOrder: ListSortOrder;
}

export type AdapterGenreTrackListRequest = QueryRequest<AdapterGenreTrackListQuery>;

export type AdapterGenreTrackListResponse = PaginatedResponse<AdapterTrack>;

export type AdapterGenreTrackListCountQuery = Omit<
    AdapterGenreTrackListQuery,
    'sortBy' | 'sortOrder' | 'limit' | 'offset'
>;

export type AdapterGenreTrackListCountRequest = QueryRequest<AdapterGenreTrackListCountQuery>;

export type AdapterGenreTrackListCountResponse = number;
