import type { AdapterAlbum } from '@/adapters/types/adapter-album-types.js';
import type { AdapterAlbumArtist } from '@/adapters/types/adapter-artist-types.js';
import type { AdapterTrack } from '@/adapters/types/adapter-track-types.js';
import type { QueryRequest } from '@/adapters/types/shared-types.js';

export type SearchQuery = {
    albumArtistLimit?: number;
    albumArtistStartIndex?: number;
    albumLimit?: number;
    albumStartIndex?: number;
    musicFolderId?: string;
    query?: string;
    songLimit?: number;
    songStartIndex?: number;
};

export type SearchSongsQuery = {
    musicFolderId?: string;
    query?: string;
    songLimit?: number;
    songStartIndex?: number;
};

export type SearchAlbumsQuery = {
    albumLimit?: number;
    albumStartIndex?: number;
    musicFolderId?: string;
    query?: string;
};

export type SearchAlbumArtistsQuery = {
    albumArtistLimit?: number;
    albumArtistStartIndex?: number;
    musicFolderId?: string;
    query?: string;
};

export type SearchRequest = QueryRequest<SearchQuery>;

export type SearchResponse = {
    albums: AdapterAlbum[];
    artists: AdapterAlbumArtist[];
    songs: AdapterTrack[];
};
