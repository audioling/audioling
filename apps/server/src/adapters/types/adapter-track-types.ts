import type { AdapterRelatedArtist } from '@/adapters/types/adapter-artist-types.js';
import type { AdapterRelatedGenre } from '@/adapters/types/adapter-genre-types.js';
import type { AdapterSortOrder } from '@/adapters/types/index.js';
import type { PaginatedResponse, QueryRequest } from '@/adapters/types/shared-types.js';

export interface AdapterTrack {
    album: string;
    albumId: string;
    artistId: string | null;
    artistName: string | null;
    artists: AdapterRelatedArtist[];
    bitrate: number | null;
    bpm: number | null;
    channels: number | null;
    comment: string | null;
    container: string;
    createdAt: string;
    discNumber: string;
    discSubtitle: string | null;
    duration: number;
    external: {
        musicbrainz: {
            id: string | null;
            name: string | null;
        };
    };
    fileName: string;
    filePath: string;
    fileSize: number;
    genres: AdapterRelatedGenre[];
    id: string;
    isCompilation: boolean;
    lastPlayedAt: string | null;
    lyrics: string | null;
    name: string;
    playCount: number;
    releaseDate: string;
    releaseYear: number;
    replayGain: {
        albumGain: number | null;
        albumPeak: number | null;
        trackGain: number | null;
        trackPeak: number | null;
    };
    samplerate: number | null;
    trackNumber: number;
    updatedAt: string;
    userFavorite: boolean;
    userRating: number | null;
}

export type AdapterTrackListResponse = PaginatedResponse<AdapterTrack>;

export enum AdapterTrackListSort {
    ALBUM = 'album',
    ALBUM_ARTIST = 'albumArtist',
    ARTIST = 'artist',
    BPM = 'bpm',
    CHANNELS = 'channels',
    COMMENT = 'comment',
    DURATION = 'duration',
    FAVORITED = 'favorited',
    GENRE = 'genre',
    ID = 'id',
    NAME = 'name',
    PLAY_COUNT = 'playCount',
    RANDOM = 'random',
    RATING = 'rating',
    RECENTLY_ADDED = 'recentlyAdded',
    RECENTLY_PLAYED = 'recentlyPlayed',
    RELEASE_DATE = 'releaseDate',
    YEAR = 'year',
}

export type AdapterTrackListQuery = {
    albumIds?: string[];
    artistIds?: string[];
    imageSize?: number;
    limit?: number;
    musicFolderId?: string;
    searchTerm?: string;
    sortBy: AdapterTrackListSort;
    sortOrder: AdapterSortOrder;
    startIndex: number;
};

export type AdapterTrackListRequest = { query: AdapterTrackListQuery };

export type AdapterTrackListCountQuery = AdapterTrackListQuery;

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
    genre?: string;
    limit?: number;
    maxYear?: number;
    minYear?: number;
    musicFolderId?: string;
};

export type AdapterRandomTrackListRequest = QueryRequest<AdapterRandomTrackListQuery>;

export type AdapterRandomTrackListResponse = AdapterTrackListResponse;

export type AdapterSimilarTrackListQuery = {
    count?: number;
    songId: string;
};

export type AdapterSimilarTrackListRequest = QueryRequest<AdapterSimilarTrackListQuery>;

export type AdapterSimilarTrackListResponse = AdapterTrackListResponse;
