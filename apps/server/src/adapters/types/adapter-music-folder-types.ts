import type { PaginatedResponse, QueryRequest } from '@/adapters/types/shared-types.js';

export interface AdapterMusicFolder {
    id: string;
    name: string;
}

export type AdapterMusicFolderListResponse = PaginatedResponse<AdapterMusicFolder>;

export type AdapterMusicFolderListQuery = {
    limit: number;
    offset: number;
};

export type AdapterMusicFolderListRequest = QueryRequest<AdapterMusicFolderListQuery>;
