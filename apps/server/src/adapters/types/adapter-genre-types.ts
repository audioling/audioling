import type { AdapterSortOrder } from '@/adapters/types/index.js';
import type { PaginatedResponse, QueryRequest } from '@/adapters/types/shared-types.js';

export interface AdapterGenre {
    id: string;
    name: string;
}

export interface AdapterRelatedGenre {
    id: string;
    name: string;
}

export type AdapterGenreListResponse = PaginatedResponse<AdapterGenre>;

export type AdapterGenreListQuery = {
    limit: number;
    musicFolderId?: string;
    sortBy: AdapterGenreListSort;
    sortOrder: AdapterSortOrder;
    startIndex: number;
};

export type AdapterGenreListRequest = QueryRequest<AdapterGenreListQuery>;

export enum AdapterGenreListSort {
    NAME = 'name',
}
