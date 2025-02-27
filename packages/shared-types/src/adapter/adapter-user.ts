import type { AuthUserPermissions, ListSortOrder } from '../app/_app-types.js';
import type { PaginatedResponse, QueryRequest } from './_shared.js';

export interface AdapterUser {
    credential: string;
    permissions: AuthUserPermissions;
    username: string;
}

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
