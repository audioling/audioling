import type { AlbumListSortOptions, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import type { AdapterRelatedArtist } from '@/adapters/types/adapter-artist-types.js';
import type { AdapterRelatedGenre } from '@/adapters/types/adapter-genre-types.js';
import type { AdapterTrackListResponse } from '@/adapters/types/adapter-track-types.js';
import type { PaginatedResponse, QueryRequest } from '@/adapters/types/shared-types.js';

export interface AdapterAlbum {
    artist: string | null;
    artistId: string | null;
    artists: AdapterRelatedArtist[];
    comment: string | null;
    createdDate: string;
    description: string | null;
    discTitles: {
        disc: number;
        title: string;
    }[];
    displayArtist: string | null;
    duration: number;
    external: {
        musicBrainzId?: string;
    };
    genres: AdapterRelatedGenre[];
    id: string;
    imageUrl: string | null;
    isCompilation: boolean;
    moods: {
        id: string;
        name: string;
    }[];
    name: string;
    originalReleaseDate: string | null;
    recordLabels: {
        id: string;
        name: string;
    }[];
    releaseDate: string | null;
    releaseTypes: {
        id: string;
        name: string;
    }[];
    releaseYear: number | null;
    size: number | null;
    songCount: number | null;
    sortName: string;
    updatedDate: string | null;
    userFavorite: boolean;
    userFavoriteDate: string | null;
    userLastPlayedDate: string | null;
    userPlayCount: number | null;
    userRating: number | null;
    userRatingDate: string | null;
}

export type AdapterAlbumListResponse = PaginatedResponse<AdapterAlbum>;

export type AdapterAlbumListQuery = {
    folderId?: string[];
    limit: number;
    offset: number;
    searchTerm?: string;
    sortBy: AlbumListSortOptions;
    sortOrder: ListSortOrder;
};

export type AdapterAlbumListRequest = QueryRequest<AdapterAlbumListQuery>;

export type AdapterAlbumListCountQuery = Omit<
    AdapterAlbumListQuery,
    'sortBy' | 'sortOrder' | 'limit' | 'offset'
>;

export type AdapterAlbumListCountRequest = QueryRequest<AdapterAlbumListCountQuery>;

export type AdapterAlbumListCountResponse = number;

export type AdapterAlbumDetailQuery = {
    id: string;
};

export type AdapterAlbumDetailRequest = QueryRequest<AdapterAlbumDetailQuery>;

export type AdapterAlbumDetailResponse = AdapterAlbum;

export type AdapterAlbumTrackListQuery = {
    id: string;
    limit: number;
    offset: number;
    sortBy: TrackListSortOptions;
    sortOrder: ListSortOrder;
};

export type AdapterAlbumTrackListRequest = QueryRequest<AdapterAlbumTrackListQuery>;

export type AdapterAlbumTrackListResponse = AdapterTrackListResponse;
