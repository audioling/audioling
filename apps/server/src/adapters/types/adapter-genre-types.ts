import type { GenreListSortOptions, ListSortOrder } from '@repo/shared-types';
import type { PaginatedResponse, QueryRequest } from '@/adapters/types/shared-types.js';

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

export type AdapterGenreListQuery = {
    folderId?: string[];
    limit: number;
    offset: number;
    searchTerm?: string;
    sortBy: GenreListSortOptions;
    sortOrder: ListSortOrder;
};

export type AdapterGenreListRequest = QueryRequest<AdapterGenreListQuery>;

export type AdapterGenreListCountQuery = Omit<
    AdapterGenreListQuery,
    'sortBy' | 'sortOrder' | 'limit' | 'offset'
>;

export type AdapterGenreListCountRequest = QueryRequest<AdapterGenreListCountQuery>;

export type AdapterGenreListCountResponse = number;
