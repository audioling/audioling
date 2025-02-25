import type { ListSortOrder } from '../app/_app-types.js';
import type { AdapterUser } from './_adapter-types.js';
import type { PaginatedResponse, QueryRequest } from './_shared.js';

export type AdapterUserListResponse = PaginatedResponse<AdapterUser>;

export enum AdapterUserListSort {
    NAME = 'name',
}

export interface AdapterUserListQuery {
    limit?: number;
    offset: number;
    searchTerm?: string;
    sortBy: AdapterUserListSort;
    sortOrder: ListSortOrder;
}

export type AdapterUserListRequest = QueryRequest<AdapterUserListQuery>;
