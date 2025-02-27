import type { AuthServer, AuthUserPermissions, ServerItemType, ServerType } from '../app/_app-types.js';
import type {
    AdapterAlbumDetailRequest,
    AdapterAlbumDetailResponse,
    AdapterAlbumListCountRequest,
    AdapterAlbumListCountResponse,
    AdapterAlbumListRequest,
    AdapterAlbumListResponse,
    AdapterAlbumTrackListRequest,
    AdapterAlbumTrackListResponse,
} from './adapter-album.js';
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
} from './adapter-artist.js';
import type {
    AdapterSetFavoriteRequest,
    AdapterSetFavoriteResponse,
} from './adapter-favorite.js';
import type {
    AdapterGenreListCountRequest,
    AdapterGenreListCountResponse,
    AdapterGenreListRequest,
    AdapterGenreListResponse,
    AdapterGenreTrackListCountRequest,
    AdapterGenreTrackListCountResponse,
    AdapterGenreTrackListRequest,
    AdapterGenreTrackListResponse,
} from './adapter-genre.js';
import type {
    AdapterMusicFolderListRequest,
    AdapterMusicFolderListResponse,
} from './adapter-music-folder.js';
import type {
    AdapterAddToPlaylistRequest,
    AdapterAddToPlaylistResponse,
    AdapterClearPlaylistRequest,
    AdapterClearPlaylistResponse,
    AdapterCreatePlaylistRequest,
    AdapterCreatePlaylistResponse,
    AdapterDeletePlaylistRequest,
    AdapterDeletePlaylistResponse,
    AdapterPlaylistDetailRequest,
    AdapterPlaylistDetailResponse,
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
    AdapterUpdatePlaylistRequest,
    AdapterUpdatePlaylistResponse,
} from './adapter-playlist.js';
import type {
    AdapterSetRatingRequest,
    AdapterSetRatingResponse,
} from './adapter-rating.js';
import type { AdapterScrobbleRequest, AdapterScrobbleResponse } from './adapter-scrobble.js';
import type {
    AdapterTrackDetailRequest,
    AdapterTrackDetailResponse,
    AdapterTrackListCountRequest,
    AdapterTrackListCountResponse,
    AdapterTrackListRequest,
    AdapterTrackListResponse,
} from './adapter-track.js';
import type { AdapterUser } from './adapter-user.js';

export * from './adapter-album.js';
export * from './adapter-artist.js';
export * from './adapter-favorite.js';
export * from './adapter-genre.js';
export * from './adapter-lyrics.js';
export * from './adapter-music-folder.js';
export * from './adapter-playlist.js';
export * from './adapter-rating.js';
export * from './adapter-scrobble.js';
export * from './adapter-server.js';
export * from './adapter-stream.js';
export * from './adapter-track.js';
export * from './adapter-user.js';

export interface AdapterError {
    code: number;
    message: string;
}

interface RequestOptions {
    cache?: 'default' | 'force-cache' | 'no-cache' | 'no-store' | 'only-if-cached' | 'reload';
    credentials?: 'omit' | 'include' | 'same-origin';
    integrity?: string;
    keepalive?: boolean;
    mode?: 'same-origin' | 'cors' | 'navigate' | 'no-cors';
    priority?: 'auto' | 'high' | 'low';
    redirect?: 'error' | 'follow' | 'manual';
    referrer?: string;
    referrerPolicy?: '' | 'same-origin' | 'no-referrer' | 'no-referrer-when-downgrade'
        | 'origin' | 'origin-when-cross-origin' | 'strict-origin'
        | 'strict-origin-when-cross-origin' | 'unsafe-url';
    signal?: AbortSignal | null;
    window?: null;
}

export type AdapterFn<TRequest, TResponse> = (
    request: TRequest,
    server: AuthServer,
    options?: RequestOptions,
) => Promise<[AdapterError, null] | [null, TResponse]>;

export interface AdapterApi {
    _getCoverArtUrl: (
        args: {
            id: string;
            size?: number;
            type: ServerItemType;
        },
        server: AuthServer
    ) => string;
    _getStreamUrl: (
        args: {
            bitRate?: number;
            format?: string;
            id: string;
        },
        server: AuthServer
    ) => string;
    _getType: () => ServerType;
    album: {
        getAlbumDetail: AdapterFn<AdapterAlbumDetailRequest, AdapterAlbumDetailResponse>;
        getAlbumList: AdapterFn<AdapterAlbumListRequest, AdapterAlbumListResponse>;
        getAlbumListCount: AdapterFn<AdapterAlbumListCountRequest, AdapterAlbumListCountResponse>;
        getAlbumTrackList: AdapterFn<AdapterAlbumTrackListRequest, AdapterAlbumTrackListResponse>;
    };
    albumArtist: {
        getAlbumArtistAlbumList: AdapterFn<AdapterArtistAlbumListRequest, AdapterArtistAlbumListResponse >;
        getAlbumArtistDetail: AdapterFn<AdapterArtistDetailRequest, AdapterArtistDetailResponse>;
        getAlbumArtistList: AdapterFn<AdapterArtistListRequest, AdapterArtistListResponse>;
        getAlbumArtistListCount: AdapterFn<AdapterArtistListCountRequest, AdapterArtistListCountResponse >;
        getAlbumArtistTrackList: AdapterFn<AdapterArtistTrackListRequest, AdapterArtistTrackListResponse >;
    };
    artist: {
        getArtistDetail: AdapterFn<AdapterArtistDetailRequest, AdapterArtistDetailResponse>;
        getArtistList: AdapterFn<AdapterArtistListRequest, AdapterArtistListResponse>;
        getArtistListCount: AdapterFn<AdapterArtistListCountRequest, AdapterArtistListCountResponse>;
        getArtistTrackList: AdapterFn<AdapterArtistTrackListRequest, AdapterArtistTrackListResponse>;
    };
    auth: {
        signIn: (
            args: {
                baseUrl: string;
                credential: string;
                username: string;
            },
        ) => Promise<[AdapterError, null] | [null, AdapterUser]>;
    };
    favorite: {
        getFavoriteAlbumArtistList: AdapterFn<AdapterArtistListRequest, AdapterArtistListResponse>;
        getFavoriteAlbumList: AdapterFn<AdapterAlbumListRequest, AdapterAlbumListResponse>;
        getFavoriteTrackList: AdapterFn<AdapterTrackListRequest, AdapterTrackListResponse>;
    };
    genre: {
        getGenreList: AdapterFn<AdapterGenreListRequest, AdapterGenreListResponse>;
        getGenreListCount: AdapterFn<AdapterGenreListCountRequest, AdapterGenreListCountResponse>;
        getGenreTrackList: AdapterFn<AdapterGenreTrackListRequest, AdapterGenreTrackListResponse>;
        getGenreTrackListCount: AdapterFn<AdapterGenreTrackListCountRequest, AdapterGenreTrackListCountResponse >;
    };
    meta: {
        scrobble: AdapterFn<AdapterScrobbleRequest, AdapterScrobbleResponse>;
        setFavorite: AdapterFn<AdapterSetFavoriteRequest, AdapterSetFavoriteResponse>;
        setRating: AdapterFn<AdapterSetRatingRequest, AdapterSetRatingResponse>;
    };
    musicFolder: {
        getMusicFolderList: AdapterFn<AdapterMusicFolderListRequest, AdapterMusicFolderListResponse>;
    };
    playlist: {
        addToPlaylist: AdapterFn<AdapterAddToPlaylistRequest, AdapterAddToPlaylistResponse>;
        clearPlaylist: AdapterFn<AdapterClearPlaylistRequest, AdapterClearPlaylistResponse>;
        createPlaylist: AdapterFn<AdapterCreatePlaylistRequest, AdapterCreatePlaylistResponse>;
        deletePlaylist: AdapterFn<AdapterDeletePlaylistRequest, AdapterDeletePlaylistResponse>;
        getPlaylistDetail: AdapterFn<AdapterPlaylistDetailRequest, AdapterPlaylistDetailResponse>;
        getPlaylistList: AdapterFn<AdapterPlaylistListRequest, AdapterPlaylistListResponse>;
        getPlaylistListCount: AdapterFn<AdapterPlaylistListCountRequest, AdapterPlaylistListCountResponse>;
        getPlaylistTrackList: AdapterFn<AdapterPlaylistTrackListRequest, AdapterPlaylistTrackListResponse >;
        getPlaylistTrackListCount: AdapterFn<
            AdapterPlaylistTrackListCountRequest,
            AdapterPlaylistTrackListCountResponse
        >;
        removeFromPlaylist: AdapterFn<AdapterRemoveFromPlaylistRequest, AdapterRemoveFromPlaylistResponse >;
        updatePlaylist: AdapterFn<AdapterUpdatePlaylistRequest, AdapterUpdatePlaylistResponse>;
    };
    track: {
        getTrackDetail: AdapterFn<AdapterTrackDetailRequest, AdapterTrackDetailResponse>;
        getTrackList: AdapterFn<AdapterTrackListRequest, AdapterTrackListResponse>;
        getTrackListCount: AdapterFn<AdapterTrackListCountRequest, AdapterTrackListCountResponse>;
    };
}
