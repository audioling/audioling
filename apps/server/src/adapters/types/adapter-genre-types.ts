import type { ListSortOrder } from '@repo/shared-types';
import type { PaginatedResponse, QueryRequest } from '@/adapters/types/shared-types.js';

export interface AdapterGenre {
    id: string;
    name: string;
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
    sortBy: AdapterGenreListSort;
    sortOrder: ListSortOrder;
};

export type AdapterGenreListRequest = QueryRequest<AdapterGenreListQuery>;

export enum AdapterGenreListSort {
    NAME = 'name',
}

export type AdapterGenreListCountQuery = Omit<
    AdapterGenreListQuery,
    'sortBy' | 'sortOrder' | 'limit' | 'offset'
>;

export type AdapterGenreListCountRequest = QueryRequest<AdapterGenreListCountQuery>;
