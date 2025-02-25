import type { ListSortOrder, TrackListSortOptions } from '../app/_app-types.js';
import type { PaginatedResponse, QueryRequest } from './_shared.js';
import type { AdapterRelatedArtist } from './adapter-artist.js';
import type { AdapterRelatedGenre } from './adapter-genre.js';

export interface AdapterTrack {
    album: string | null;
    albumArtists: AdapterRelatedArtist[];
    albumId: string | null;
    artistId: string | null;
    artistName: string | null;
    artists: AdapterRelatedArtist[];
    bitDepth: number | null;
    bitRate: number | null;
    bpm: number | null;
    channelCount: number | null;
    comment: string | null;
    contributors: {
        artist: AdapterRelatedArtist;
        role: string;
        subRole: string | null;
    }[];
    createdDate: string | null;
    discNumber: string;
    discSubtitle: string | null;
    displayAlbumArtist: string | null;
    displayArtist: string | null;
    displayComposer: string | null;
    duration: number;
    external: {
        musicBrainzId?: string;
    };
    fileContainer: string | null;
    fileName: string | null;
    filePath: string | null;
    fileSize: number | null;
    genres: AdapterRelatedGenre[];
    id: string;
    imageUrl: string[];
    isCompilation: boolean;
    lyrics: string | null;
    moods: {
        id: string;
        name: string;
    }[];
    name: string;
    releaseYear: number | null;
    rgAlbumGain: number | null;
    rgAlbumPeak: number | null;
    rgBaseGain: number | null;
    rgTrackGain: number | null;
    rgTrackPeak: number | null;
    sampleRate: number | null;
    sortName: string;
    trackNumber: number;
    updatedDate: string | null;
    userFavorite: boolean;
    userFavoriteDate: string | null;
    userLastPlayedDate: string | null;
    userPlayCount: number;
    userRating: number | null;
    userRatingDate: string | null;
}

export type AdapterTrackListResponse = PaginatedResponse<AdapterTrack>;

export interface AdapterTrackListQuery {
    folderId?: string[];
    genreId?: string;
    imageSize?: number;
    limit: number;
    offset: number;
    searchTerm?: string;
    sortBy: TrackListSortOptions;
    sortOrder: ListSortOrder;
}

export interface AdapterTrackListRequest { query: AdapterTrackListQuery }

export type AdapterTrackListCountQuery = Omit<
    AdapterTrackListQuery,
    'sortOrder' | 'limit' | 'offset'
>;

export type AdapterTrackListCountRequest = QueryRequest<AdapterTrackListCountQuery>;

export type AdapterTrackListCountResponse = number;

export type AdapterTrackDetailResponse = AdapterTrack;

export interface AdapterTrackDetailQuery { id: string }

export type AdapterTrackDetailRequest = QueryRequest<AdapterTrackDetailQuery>;

export type AdapterTopTrackListResponse = PaginatedResponse<AdapterTrack>;

export interface AdapterTopTrackListQuery {
    artist: string;
    artistId: string;
    limit?: number;
}

export type AdapterTopTrackListRequest = QueryRequest<AdapterTopTrackListQuery>;

export interface AdapterRandomTrackListQuery {
    folderId?: string[];
    genre?: string;
    limit?: number;
    maxYear?: number;
    minYear?: number;
}

export type AdapterRandomTrackListRequest = QueryRequest<AdapterRandomTrackListQuery>;

export type AdapterRandomTrackListResponse = AdapterTrackListResponse;

export interface AdapterSimilarTrackListQuery {
    count?: number;
    songId: string;
}

export type AdapterSimilarTrackListRequest = QueryRequest<AdapterSimilarTrackListQuery>;

export type AdapterSimilarTrackListResponse = AdapterTrackListResponse;
