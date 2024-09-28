import type { ListSortOrder } from '@repo/shared-types';
import type { AdapterUser } from '@/adapters/types/index.js';
import type { PaginatedResponse, QueryRequest } from '@/adapters/types/shared-types.js';

export type AdapterUserListResponse = PaginatedResponse<AdapterUser>;

export enum AdapterUserListSort {
    NAME = 'name',
}

export type AdapterUserListQuery = {
    limit?: number;
    offset: number;
    searchTerm?: string;
    sortBy: AdapterUserListSort;
    sortOrder: ListSortOrder;
};

export type AdapterUserListRequest = QueryRequest<AdapterUserListQuery>;
