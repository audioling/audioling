import type { ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import type { AdapterRelatedArtist } from '@/adapters/types/adapter-artist-types.js';
import type { AdapterRelatedGenre } from '@/adapters/types/adapter-genre-types.js';
import type { PaginatedResponse, QueryRequest } from '@/adapters/types/shared-types.js';

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

export type AdapterTrackListQuery = {
    folderId?: string[];
    genreId?: string;
    imageSize?: number;
    limit: number;
    offset: number;
    searchTerm?: string;
    sortBy: TrackListSortOptions;
    sortOrder: ListSortOrder;
};

export type AdapterTrackListRequest = { query: AdapterTrackListQuery };

export type AdapterTrackListCountQuery = Omit<
    AdapterTrackListQuery,
    'sortBy' | 'sortOrder' | 'limit' | 'offset'
>;

export type AdapterTrackListCountRequest = QueryRequest<AdapterTrackListCountQuery>;

export type AdapterTrackListCountResponse = number;

export type AdapterTrackDetailResponse = AdapterTrack;

export type AdapterTrackDetailQuery = { id: string };

export type AdapterTrackDetailRequest = QueryRequest<AdapterTrackDetailQuery>;

export type AdapterTopTrackListResponse = PaginatedResponse<AdapterTrack>;

export type AdapterTopTrackListQuery = {
    artist: string;
    artistId: string;
    limit?: number;
};

export type AdapterTopTrackListRequest = QueryRequest<AdapterTopTrackListQuery>;

export type AdapterRandomTrackListQuery = {
    folderId?: string[];
    genre?: string;
    limit?: number;
    maxYear?: number;
    minYear?: number;
};

export type AdapterRandomTrackListRequest = QueryRequest<AdapterRandomTrackListQuery>;

export type AdapterRandomTrackListResponse = AdapterTrackListResponse;

export type AdapterSimilarTrackListQuery = {
    count?: number;
    songId: string;
};

export type AdapterSimilarTrackListRequest = QueryRequest<AdapterSimilarTrackListQuery>;

export type AdapterSimilarTrackListResponse = AdapterTrackListResponse;
