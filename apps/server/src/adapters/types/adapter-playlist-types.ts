import type { AdapterRelatedGenre } from '@/adapters/types/adapter-genre-types.js';
import type { AdapterTrack, AdapterTrackListSort } from '@/adapters/types/adapter-track-types.js';
import type { AdapterSortOrder } from '@/adapters/types/index.js';
import type {
    PaginatedResponse,
    QueryMutation,
    QueryRequest,
} from '@/adapters/types/shared-types.js';

export interface AdapterPlaylist {
    description: string | null;
    duration: number | null;
    genres: AdapterRelatedGenre[];
    id: string;
    imageUrl: string | null;
    name: string;
    owner: string | null;
    ownerId: string | null;
    public: boolean | null;
    size: number | null;
    songCount: number | null;
    // rules?: Record<string, string | boolean> | null;
    // sync?: boolean | null;
}

type ClearPlaylistQuery = {
    id: string;
};

export type ClearPlaylistRequest = QueryRequest<ClearPlaylistQuery>;

export type ClearPlaylistResponse = null;

export type AddToPlaylistResponse = null;

type AddToPlaylistQuery = {
    id: string;
};

type AddToPlaylistBody = {
    entry: {
        id: string;
        type: 'album' | 'song';
    }[];
};

export type AddToPlaylistRequest = QueryMutation<AddToPlaylistQuery, AddToPlaylistBody>;

export type RemoveFromPlaylistResponse = null;

export type RemoveFromPlaylistQuery = {
    id: string;
};

export type RemoveFromPlaylistBody = {
    entry: string[];
};

export type RemoveFromPlaylistRequest = QueryMutation<
    RemoveFromPlaylistQuery,
    RemoveFromPlaylistBody
>;

export type CreatePlaylistResponse = null;

export type CreatePlaylistBody = {
    comment?: string;
    name: string;
    owner?: string;
    ownerId?: string;
    public?: boolean;
    rules?: Record<string, string | number | boolean>;
    sync?: boolean;
};

export type CreatePlaylistRequest = QueryMutation<CreatePlaylistResponse, CreatePlaylistBody>;

export type UpdatePlaylistResponse = null;

export type UpdatePlaylistQuery = {
    id: string;
};

export type UpdatePlaylistBody = {
    comment?: string;
    name: string;
    owner?: string;
    ownerId?: string;
    public?: boolean;
    rules?: Record<string, string | number | boolean>;
    sync?: boolean;
};

export type UpdatePlaylistRequest = QueryMutation<UpdatePlaylistQuery, UpdatePlaylistBody>;

export type DeletePlaylistResponse = null;

export type DeletePlaylistQuery = { id: string };

export type DeletePlaylistRequest = QueryMutation<DeletePlaylistQuery>;

export type PlaylistListResponse = PaginatedResponse<AdapterPlaylist>;

export enum PlaylistListSort {
    DURATION = 'duration',
    NAME = 'name',
    OWNER = 'owner',
    PUBLIC = 'public',
    SONG_COUNT = 'songCount',
    UPDATED_AT = 'updatedAt',
}

export type PlaylistListQuery = {
    limit: number;
    searchTerm?: string;
    sortBy: PlaylistListSort;
    sortOrder: AdapterSortOrder;
    startIndex: number;
    userId?: string;
};

export type PlaylistListRequest = QueryRequest<PlaylistListQuery>;

export type PlaylistListCountQuery = PlaylistListQuery;

export type PlaylistListCountRequest = QueryRequest<PlaylistListCountQuery>;

export type PlaylistListCountResponse = number;

export type PlaylistDetailResponse = AdapterPlaylist;

export type PlaylistDetailQuery = {
    id: string;
};

export type PlaylistDetailRequest = QueryRequest<PlaylistDetailQuery>;

export type PlaylistTrackListResponse = PaginatedResponse<AdapterTrack>;

export type PlaylistSongListQuery = {
    id: string;
    limit: number;
    sortBy?: AdapterTrackListSort;
    sortOrder?: AdapterSortOrder;
    startIndex: number;
};

export type PlaylistTrackListRequest = QueryRequest<PlaylistSongListQuery>;

export type PlaylistSongListCountQuery = PlaylistSongListQuery;

export type PlaylistTrackListCountRequest = QueryRequest<PlaylistSongListCountQuery>;

export type PlaylistTrackListCountResponse = number;
