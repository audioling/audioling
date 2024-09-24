import type { AdapterTrack } from '@/adapters/types/adapter-track-types.js';
import type { BaseEndpointArgs, QueryRequest } from './shared-types.js';

export type LyricsQuery = {
    songId: string;
};

export type LyricsRequest = QueryRequest<LyricsQuery>;

export type SynchronizedLyricsArray = Array<[number, string]>;

export type LyricsResponse = SynchronizedLyricsArray | string;

export type InternetProviderLyricResponse = {
    artist: string;
    id: string;
    lyrics: string;
    name: string;
    source: LyricSource;
};

export type InternetProviderLyricSearchResponse = {
    artist: string;
    id: string;
    name: string;
    score?: number;
    source: LyricSource;
};

export type FullLyricsMetadata = {
    lyrics: LyricsResponse;
    remote: boolean;
    source: string;
} & Omit<InternetProviderLyricResponse, 'id' | 'lyrics' | 'source'>;

export type LyricOverride = Omit<InternetProviderLyricResponse, 'lyrics'>;

export type LyricSearchQuery = {
    album?: string;
    artist?: string;
    duration?: number;
    name?: string;
};

export type LyricGetQuery = {
    remoteSongId: string;
    remoteSource: LyricSource;
    song: AdapterTrack;
};

export enum LyricSource {
    GENIUS = 'Genius',
    LRCLIB = 'lrclib.net',
    NETEASE = 'NetEase',
}

export type LyricsOverride = Omit<FullLyricsMetadata, 'lyrics'> & { id: string };

export type StructuredLyricsRequest = {
    query: LyricsQuery;
} & BaseEndpointArgs;

export type StructuredUnsyncedLyric = {
    lyrics: string;
    synced: false;
} & Omit<FullLyricsMetadata, 'lyrics'>;

export type StructuredSyncedLyric = {
    lyrics: SynchronizedLyricsArray;
    synced: true;
} & Omit<FullLyricsMetadata, 'lyrics'>;

export type StructuredLyric = {
    lang: string;
} & (StructuredUnsyncedLyric | StructuredSyncedLyric);

export type StructuredLyricResponse = StructuredLyric[];
