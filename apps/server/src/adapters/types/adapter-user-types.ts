import type { AdapterSortOrder, AdapterUser } from '@/adapters/types/index.js';
import type { PaginatedResponse, QueryRequest } from '@/adapters/types/shared-types.js';

export type UserListResponse = PaginatedResponse<AdapterUser>;

export enum UserListSort {
    NAME = 'name',
}

export type UserListQuery = {
    limit?: number;
    searchTerm?: string;
    sortBy: UserListSort;
    sortOrder: AdapterSortOrder;
    startIndex: number;
};

export type UserListRequest = QueryRequest<UserListQuery>;

// type UserListSortMap = {
//   jellyfin: Record<UserListSort, undefined>;
//   navidrome: Record<UserListSort, NDUserListSort | undefined>;
//   subsonic: Record<UserListSort, undefined>;
// };

// export const userListSortMap: UserListSortMap = {
//   jellyfin: {
//     name: undefined,
//   },
//   navidrome: {
//     name: NDUserListSort.NAME,
//   },
//   subsonic: {
//     name: undefined,
//   },
// };
