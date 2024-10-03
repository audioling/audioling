import type { FetchOptions } from '@audioling/open-subsonic-api-client';
import type { LibraryType } from '@repo/shared-types';
import type {
    AdapterAlbumDetailRequest,
    AdapterAlbumDetailResponse,
    AdapterAlbumListCountRequest,
    AdapterAlbumListCountResponse,
    AdapterAlbumListRequest,
    AdapterAlbumListResponse,
    AdapterAlbumTrackListRequest,
    AdapterAlbumTrackListResponse,
} from '@/adapters/types/adapter-album-types.js';
import type {
    AdapterArtistAlbumListRequest,
    AdapterArtistAlbumListResponse,
    AdapterArtistDetailRequest,
    AdapterArtistDetailResponse,
    AdapterArtistListCountRequest,
    AdapterArtistListCountResponse,
    AdapterArtistListRequest,
    AdapterArtistListResponse,
    AdapterArtistTrackListRequest,
    AdapterArtistTrackListResponse,
} from '@/adapters/types/adapter-artist-types.js';
import type {
    AdapterSetFavoriteRequest,
    AdapterSetFavoriteResponse,
} from '@/adapters/types/adapter-favorite-types.js';
import type {
    AdapterGenreListRequest,
    AdapterGenreListResponse,
} from '@/adapters/types/adapter-genre-types.js';
import type {
    AdapterMusicFolderListRequest,
    AdapterMusicFolderListResponse,
} from '@/adapters/types/adapter-music-folder-types.js';
import type {
    AdapterAddToPlaylistRequest,
    AdapterAddToPlaylistResponse,
    AdapterClearPlaylistRequest,
    AdapterClearPlaylistResponse,
    AdapterPlaylistListCountRequest,
    AdapterPlaylistListCountResponse,
    AdapterPlaylistListRequest,
    AdapterPlaylistListResponse,
    AdapterPlaylistTrackListCountRequest,
    AdapterPlaylistTrackListCountResponse,
    AdapterPlaylistTrackListRequest,
    AdapterPlaylistTrackListResponse,
    AdapterRemoveFromPlaylistRequest,
    AdapterRemoveFromPlaylistResponse,
} from '@/adapters/types/adapter-playlist-types.js';
import type {
    AdapterSetRatingRequest,
    AdapterSetRatingResponse,
} from '@/adapters/types/adapter-rating-types.js';
import type {
    AdapterScrobbleRequest,
    AdapterScrobbleResponse,
} from '@/adapters/types/adapter-scrobble-types.js';
import type { AdapterAuthenticationResponse } from '@/adapters/types/adapter-server-types.js';
import type {
    AdapterStreamRequest,
    AdapterStreamResponse,
} from '@/adapters/types/adapter-stream-types.js';
import type {
    AdapterTrackDetailRequest,
    AdapterTrackDetailResponse,
    AdapterTrackListCountRequest,
    AdapterTrackListCountResponse,
    AdapterTrackListRequest,
    AdapterTrackListResponse,
} from '@/adapters/types/adapter-track-types.js';
import type { AppDatabase } from '@/database/init-database.js';
import type { DbLibrary } from '@/database/library-database.js';

export interface AdapterUser {
    id: string;
    username: string;
}

export interface AdapterError {
    code: number;
    message: string;
}

type AdapterFn<TRequest, TResponse> = (
    request: TRequest,
    fetchOptions?: FetchOptions,
) => Promise<[AdapterError, null] | [null, TResponse]>;

export type AdapterApi = {
    _getLibrary: () => DbLibrary;
    _getType: () => LibraryType;
    addToPlaylist: AdapterFn<AdapterAddToPlaylistRequest, AdapterAddToPlaylistResponse>;
    clearPlaylist: AdapterFn<AdapterClearPlaylistRequest, AdapterClearPlaylistResponse>;
    getAlbumArtistAlbumList: AdapterFn<
        AdapterArtistAlbumListRequest,
        AdapterArtistAlbumListResponse
    >;
    getAlbumArtistDetail: AdapterFn<AdapterArtistDetailRequest, AdapterArtistDetailResponse>;
    getAlbumArtistList: AdapterFn<AdapterArtistListRequest, AdapterArtistListResponse>;
    getAlbumArtistListCount: AdapterFn<
        AdapterArtistListCountRequest,
        AdapterArtistListCountResponse
    >;
    getAlbumArtistTrackList: AdapterFn<
        AdapterArtistTrackListRequest,
        AdapterArtistTrackListResponse
    >;
    getAlbumDetail: AdapterFn<AdapterAlbumDetailRequest, AdapterAlbumDetailResponse>;
    getAlbumList: AdapterFn<AdapterAlbumListRequest, AdapterAlbumListResponse>;
    getAlbumListCount: AdapterFn<AdapterAlbumListCountRequest, AdapterAlbumListCountResponse>;
    getAlbumTrackList: AdapterFn<AdapterAlbumTrackListRequest, AdapterAlbumTrackListResponse>;
    getArtistList: AdapterFn<AdapterArtistListRequest, AdapterArtistListResponse>;
    getArtistListCount: AdapterFn<AdapterArtistListCountRequest, AdapterArtistListCountResponse>;
    getFavoriteAlbumList: AdapterFn<AdapterAlbumListRequest, AdapterAlbumListResponse>;
    getFavoriteArtistList: AdapterFn<AdapterArtistListRequest, AdapterArtistListResponse>;
    getFavoriteTrackList: AdapterFn<AdapterTrackListRequest, AdapterTrackListResponse>;
    getGenreList: AdapterFn<AdapterGenreListRequest, AdapterGenreListResponse>;
    getMusicFolderList: AdapterFn<AdapterMusicFolderListRequest, AdapterMusicFolderListResponse>;
    getPlaylistList: AdapterFn<AdapterPlaylistListRequest, AdapterPlaylistListResponse>;
    getPlaylistListCount: AdapterFn<
        AdapterPlaylistListCountRequest,
        AdapterPlaylistListCountResponse
    >;
    getPlaylistTrackList: AdapterFn<
        AdapterPlaylistTrackListRequest,
        AdapterPlaylistTrackListResponse
    >;
    getPlaylistTrackListCount: AdapterFn<
        AdapterPlaylistTrackListCountRequest,
        AdapterPlaylistTrackListCountResponse
    >;
    getTrackDetail: AdapterFn<AdapterTrackDetailRequest, AdapterTrackDetailResponse>;
    getTrackList: AdapterFn<AdapterTrackListRequest, AdapterTrackListResponse>;
    getTrackListCount: AdapterFn<AdapterTrackListCountRequest, AdapterTrackListCountResponse>;
    removeFromPlaylist: AdapterFn<
        AdapterRemoveFromPlaylistRequest,
        AdapterRemoveFromPlaylistResponse
    >;
    scrobble: AdapterFn<AdapterScrobbleRequest, AdapterScrobbleResponse>;
    setFavorite: AdapterFn<AdapterSetFavoriteRequest, AdapterSetFavoriteResponse>;
    setRating: AdapterFn<AdapterSetRatingRequest, AdapterSetRatingResponse>;
    stream: AdapterFn<AdapterStreamRequest, AdapterStreamResponse>;
};

export type RemoteAdapter = (library: DbLibrary, db: AppDatabase) => AdapterApi;

export type AdapterAuthentication = {
    authenticate: (
        url: string,
        body: { password: string; username: string },
    ) => Promise<AdapterAuthenticationResponse>;
    ping: () => Promise<boolean>;
};
