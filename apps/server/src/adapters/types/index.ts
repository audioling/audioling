import type { FetchOptions } from '@audioling/open-subsonic-api-client';
import type { LibraryType } from '@repo/shared-types';
import type {
    AdapterAlbumDetailRequest,
    AdapterAlbumDetailResponse,
    AdapterAlbumListCountRequest,
    AdapterAlbumListCountResponse,
    AdapterAlbumListRequest,
    AdapterAlbumListResponse,
} from '@/adapters/types/adapter-album-types.js';
import type {
    AdapterArtistDetailRequest,
    AdapterArtistDetailResponse,
    AdapterArtistListCountRequest,
    AdapterArtistListCountResponse,
    AdapterArtistListRequest,
    AdapterArtistListResponse,
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
    MusicFolderListRequest,
    MusicFolderListResponse,
} from '@/adapters/types/adapter-music-folder-types.js';
import type {
    AddToPlaylistRequest,
    AddToPlaylistResponse,
    ClearPlaylistRequest,
    ClearPlaylistResponse,
    PlaylistListCountRequest,
    PlaylistListCountResponse,
    PlaylistListRequest,
    PlaylistListResponse,
    PlaylistTrackListCountRequest,
    PlaylistTrackListCountResponse,
    PlaylistTrackListRequest,
    PlaylistTrackListResponse,
    RemoveFromPlaylistRequest,
    RemoveFromPlaylistResponse,
} from '@/adapters/types/adapter-playlist-types.js';
import type { SetRatingRequest, SetRatingResponse } from '@/adapters/types/adapter-rating-types.js';
import type { ScrobbleRequest, ScrobbleResponse } from '@/adapters/types/adapter-scrobble-types.js';
import type { AuthenticationResponse } from '@/adapters/types/adapter-server-types.js';
import type { StreamRequest, StreamResponse } from '@/adapters/types/adapter-stream-types.js';
import type {
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
    _getType: () => LibraryType;
    addToPlaylist: AdapterFn<AddToPlaylistRequest, AddToPlaylistResponse>;
    clearPlaylist: AdapterFn<ClearPlaylistRequest, ClearPlaylistResponse>;
    getAlbumArtistDetail: AdapterFn<AdapterArtistDetailRequest, AdapterArtistDetailResponse>;
    getAlbumArtistList: AdapterFn<AdapterArtistListRequest, AdapterArtistListResponse>;
    getAlbumArtistListCount: AdapterFn<
        AdapterArtistListCountRequest,
        AdapterArtistListCountResponse
    >;
    getAlbumDetail: AdapterFn<AdapterAlbumDetailRequest, AdapterAlbumDetailResponse>;
    getAlbumList: AdapterFn<AdapterAlbumListRequest, AdapterAlbumListResponse>;
    getAlbumListCount: AdapterFn<AdapterAlbumListCountRequest, AdapterAlbumListCountResponse>;
    getArtistList: AdapterFn<AdapterArtistListRequest, AdapterArtistListResponse>;
    getArtistListCount: AdapterFn<AdapterArtistListCountRequest, AdapterArtistListCountResponse>;
    getFavoriteAlbumList: AdapterFn<AdapterAlbumListRequest, AdapterAlbumListResponse>;
    getFavoriteArtistList: AdapterFn<AdapterArtistListRequest, AdapterArtistListResponse>;
    getFavoriteTrackList: AdapterFn<AdapterTrackListRequest, AdapterTrackListResponse>;
    getGenreList: AdapterFn<AdapterGenreListRequest, AdapterGenreListResponse>;
    getMusicFolderList: AdapterFn<MusicFolderListRequest, MusicFolderListResponse>;
    getPlaylistList: AdapterFn<PlaylistListRequest, PlaylistListResponse>;
    getPlaylistListCount: AdapterFn<PlaylistListCountRequest, PlaylistListCountResponse>;
    getPlaylistTrackList: AdapterFn<PlaylistTrackListRequest, PlaylistTrackListResponse>;
    getPlaylistTrackListCount: AdapterFn<
        PlaylistTrackListCountRequest,
        PlaylistTrackListCountResponse
    >;
    getTrackList: AdapterFn<AdapterTrackListRequest, AdapterTrackListResponse>;
    getTrackListCount: AdapterFn<AdapterTrackListCountRequest, AdapterTrackListCountResponse>;
    removeFromPlaylist: AdapterFn<RemoveFromPlaylistRequest, RemoveFromPlaylistResponse>;
    scrobble: AdapterFn<ScrobbleRequest, ScrobbleResponse>;
    setFavorite: AdapterFn<AdapterSetFavoriteRequest, AdapterSetFavoriteResponse>;
    setRating: AdapterFn<SetRatingRequest, SetRatingResponse>;
    stream: AdapterFn<StreamRequest, StreamResponse>;
};

export type RemoteAdapter = (library: DbLibrary, db: AppDatabase) => AdapterApi;

export type AdapterAuthentication = {
    authenticate: (
        url: string,
        body: { password: string; username: string },
    ) => Promise<AuthenticationResponse>;
    ping: () => Promise<boolean>;
};
