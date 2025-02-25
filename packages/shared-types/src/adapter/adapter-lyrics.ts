import type { BaseEndpointArgs, QueryRequest } from './_shared.js';
import type { AdapterTrack } from './adapter-track.js';

export interface AdapterLyricsQuery {
    songId: string;
}

export type AdapterLyricsRequest = QueryRequest<AdapterLyricsQuery>;

export type AdapterSynchronizedLyricsArray = Array<[number, string]>;

export type AdapterLyricsResponse = AdapterSynchronizedLyricsArray | string;

export interface AdapterInternetProviderLyricResponse {
    artist: string;
    id: string;
    lyrics: string;
    name: string;
    source: AdapterLyricSource;
}

export interface AdapterInternetProviderLyricSearchResponse {
    artist: string;
    id: string;
    name: string;
    score?: number;
    source: AdapterLyricSource;
}

export type AdapterFullLyricsMetadata = {
    lyrics: AdapterLyricsResponse;
    remote: boolean;
    source: string;
} & Omit<AdapterInternetProviderLyricResponse, 'id' | 'lyrics' | 'source'>;

export type AdapterLyricOverride = Omit<AdapterInternetProviderLyricResponse, 'lyrics'>;

export interface AdapterLyricSearchQuery {
    album?: string;
    artist?: string;
    duration?: number;
    name?: string;
}

export interface AdapterLyricGetQuery {
    remoteSongId: string;
    remoteSource: AdapterLyricSource;
    song: AdapterTrack;
}

export enum AdapterLyricSource {
    GENIUS = 'Genius',
    LRCLIB = 'lrclib.net',
    NETEASE = 'NetEase',
}

export type AdapterLyricsOverride = Omit<AdapterFullLyricsMetadata, 'lyrics'> & { id: string };

export type AdapterStructuredLyricsRequest = {
    query: AdapterLyricsQuery;
} & BaseEndpointArgs;

export type AdapterStructuredUnsyncedLyric = {
    lyrics: string;
    synced: false;
} & Omit<AdapterFullLyricsMetadata, 'lyrics'>;

export type AdapterStructuredSyncedLyric = {
    lyrics: AdapterSynchronizedLyricsArray;
    synced: true;
} & Omit<AdapterFullLyricsMetadata, 'lyrics'>;

export type AdapterStructuredLyric = {
    lang: string;
} & (AdapterStructuredUnsyncedLyric | AdapterStructuredSyncedLyric);

export type AdapterStructuredLyricResponse = AdapterStructuredLyric[];
