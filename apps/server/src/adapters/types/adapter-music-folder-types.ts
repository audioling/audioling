import type { PaginatedResponse, QueryRequest } from '@/adapters/types/shared-types.js';

export interface AdapterMusicFolder {
    id: string;
    name: string;
}

export type MusicFolderListResponse = PaginatedResponse<AdapterMusicFolder>;

export type MusicFolderListQuery = null;

export type MusicFolderListRequest = QueryRequest<MusicFolderListQuery>;
