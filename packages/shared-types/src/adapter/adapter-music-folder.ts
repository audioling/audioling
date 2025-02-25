import type { PaginatedResponse, QueryRequest } from './_shared.js';

export interface AdapterMusicFolder {
    id: string;
    name: string;
}

export type AdapterMusicFolderListResponse = PaginatedResponse<AdapterMusicFolder>;

export interface AdapterMusicFolderListQuery {
    limit: number;
    offset: number;
}

export type AdapterMusicFolderListRequest = QueryRequest<AdapterMusicFolderListQuery>;
