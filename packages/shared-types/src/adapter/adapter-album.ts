import type { AlbumListSortOptions, ListSortOrder, TrackListSortOptions } from '../app/_app-types.js';
import type { PaginatedResponse, QueryRequest } from './_shared.js';
import type { AdapterRelatedArtist } from './adapter-artist.js';
import type { AdapterRelatedGenre } from './adapter-genre.js';
import type { AdapterTrackListResponse } from './adapter-track.js';

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
    imageUrl: string;
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
    sortName: string;
    trackCount: number | null;
    updatedDate: string | null;
    userFavorite: boolean;
    userFavoriteDate: string | null;
    userLastPlayedDate: string | null;
    userPlayCount: number | null;
    userRating: number | null;
    userRatingDate: string | null;
}

export type AdapterAlbumListResponse = PaginatedResponse<AdapterAlbum>;

export interface AdapterAlbumListQuery {
    folderId?: string[];
    limit: number;
    offset: number;
    searchTerm?: string;
    sortBy: AlbumListSortOptions;
    sortOrder: ListSortOrder;
}

export type AdapterAlbumListRequest = QueryRequest<AdapterAlbumListQuery>;

export type AdapterAlbumListCountQuery = Omit<
    AdapterAlbumListQuery,
    'sortOrder' | 'limit' | 'offset'
>;

export type AdapterAlbumListCountRequest = QueryRequest<AdapterAlbumListCountQuery>;

export type AdapterAlbumListCountResponse = number;

export interface AdapterAlbumDetailQuery {
    id: string;
}

export type AdapterAlbumDetailRequest = QueryRequest<AdapterAlbumDetailQuery>;

export type AdapterAlbumDetailResponse = AdapterAlbum;

export interface AdapterAlbumTrackListQuery {
    id: string;
    limit: number;
    offset: number;
    sortBy: TrackListSortOptions;
    sortOrder: ListSortOrder;
}

export type AdapterAlbumTrackListRequest = QueryRequest<AdapterAlbumTrackListQuery>;

export type AdapterAlbumTrackListResponse = AdapterTrackListResponse;
