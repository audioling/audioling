import type { AdapterAlbum } from '@/adapters/types/adapter-album-types.js';
import type { AdapterArtist } from '@/adapters/types/adapter-artist-types.js';
import type { AdapterTrack } from '@/adapters/types/adapter-track-types.js';
import type { QueryRequest } from '@/adapters/types/shared-types.js';

export type AdapterSearchQuery = {
    albumArtistLimit?: number;
    albumArtistOffset?: number;
    albumLimit?: number;
    albumOffset?: number;
    folderId?: string[];
    query?: string;
    songLimit?: number;
    songOffset?: number;
};

export type AdapterSearchSongsQuery = {
    folderId?: string[];
    query?: string;
    songLimit?: number;
    songOffset?: number;
};

export type AdapterSearchAlbumsQuery = {
    albumLimit?: number;
    albumOffset?: number;
    folderId?: string[];
    query?: string;
};

export type AdapterSearchAlbumArtistsQuery = {
    albumArtistLimit?: number;
    albumArtistOffset?: number;
    folderId?: string[];
    query?: string;
};

export type AdapterSearchRequest = QueryRequest<AdapterSearchQuery>;

export type AdapterSearchResponse = {
    albums: AdapterAlbum[];
    artists: AdapterArtist[];
    songs: AdapterTrack[];
};
