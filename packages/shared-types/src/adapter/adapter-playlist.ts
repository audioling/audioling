import type { ListSortOrder, PlaylistListSortOptions, TrackListSortOptions } from '../app/_app-types.js';
import type { PaginatedResponse, QueryMutation, QueryRequest } from './_shared.js';
import type { AdapterRelatedGenre } from './adapter-genre.js';
import type { AdapterTrack } from './adapter-track.js';

export interface AdapterPlaylist {
    createdDate: string;
    description: string | null;
    duration: number | null;
    genres: AdapterRelatedGenre[];
    id: string;
    imageUrl: string;
    isPublic: boolean;
    name: string;
    owner: string | null;
    ownerId: string | null;
    parentId: string | null;
    size: number | null;
    trackCount: number | null;
    updatedDate: string;
    // rules?: Record<string, string | boolean> | null;
    // sync?: boolean | null;
}

interface AdapterClearPlaylistQuery {
    id: string;
}

export type AdapterClearPlaylistRequest = QueryRequest<AdapterClearPlaylistQuery>;

export type AdapterClearPlaylistResponse = null;

export type AdapterAddToPlaylistResponse = null;

interface AdapterAddToPlaylistQuery {
    id: string;
}

interface AdapterAddToPlaylistBody {
    entry: {
        id: string;
        type: 'album' | 'track';
    }[];
}

export type AdapterAddToPlaylistRequest = QueryMutation<
    AdapterAddToPlaylistQuery,
    AdapterAddToPlaylistBody
>;

export type AdapterRemoveFromPlaylistResponse = null;

export interface AdapterRemoveFromPlaylistQuery {
    id: string;
}

export interface AdapterRemoveFromPlaylistBody {
    entry: string[];
}

export type AdapterRemoveFromPlaylistRequest = QueryMutation<
    AdapterRemoveFromPlaylistQuery,
    AdapterRemoveFromPlaylistBody
>;

export type AdapterCreatePlaylistResponse = null;

export interface AdapterCreatePlaylistBody {
    comment?: string;
    name: string;
    owner?: string;
    ownerId?: string;
    public?: boolean;
    rules?: Record<string, string | number | boolean>;
    sync?: boolean;
}

export type AdapterCreatePlaylistRequest = QueryMutation<
    AdapterCreatePlaylistResponse,
    AdapterCreatePlaylistBody
>;

export type AdapterUpdatePlaylistResponse = null;

export interface AdapterUpdatePlaylistQuery {
    id: string;
}

export interface AdapterUpdatePlaylistBody {
    comment?: string;
    name: string;
    owner?: string;
    ownerId?: string;
    public?: boolean;
    rules?: Record<string, string | number | boolean>;
    sync?: boolean;
}

export type AdapterUpdatePlaylistRequest = QueryMutation<
    AdapterUpdatePlaylistQuery,
    AdapterUpdatePlaylistBody
>;

export type AdapterDeletePlaylistResponse = null;

export interface AdapterDeletePlaylistQuery { id: string }

export type AdapterDeletePlaylistRequest = QueryMutation<AdapterDeletePlaylistQuery>;

export type AdapterPlaylistListResponse = PaginatedResponse<AdapterPlaylist>;

export interface AdapterPlaylistListQuery {
    limit: number;
    offset: number;
    searchTerm?: string;
    sortBy: PlaylistListSortOptions;
    sortOrder: ListSortOrder;
    userId?: string;
}

export type AdapterPlaylistListRequest = QueryRequest<AdapterPlaylistListQuery>;

export type AdapterPlaylistListCountQuery = Omit<
    AdapterPlaylistListQuery,
    'sortBy' | 'sortOrder' | 'limit' | 'offset'
>;

export type AdapterPlaylistListCountRequest = QueryRequest<AdapterPlaylistListCountQuery>;

export type AdapterPlaylistListCountResponse = number;

export type AdapterPlaylistDetailResponse = AdapterPlaylist;

export interface AdapterPlaylistDetailQuery {
    id: string;
}

export type AdapterPlaylistDetailRequest = QueryRequest<AdapterPlaylistDetailQuery>;

export type AdapterPlaylistTrack = AdapterTrack & {
    playlistTrackId: string;
};

export type AdapterPlaylistTrackListResponse = PaginatedResponse<AdapterPlaylistTrack>;

export interface AdapterPlaylistTrackListQuery {
    id: string;
    limit: number;
    offset: number;
    searchTerm?: string;
    sortBy: TrackListSortOptions;
    sortOrder: ListSortOrder;
}

export type AdapterPlaylistTrackListRequest = QueryRequest<AdapterPlaylistTrackListQuery>;

export type AdapterPlaylistTrackListCountQuery = AdapterPlaylistTrackListQuery;

export type AdapterPlaylistTrackListCountRequest = QueryRequest<AdapterPlaylistTrackListCountQuery>;

export type AdapterPlaylistTrackListCountResponse = number;
