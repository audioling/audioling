import { localize } from '@repo/localization';
import JellyfinLogo from './assets/jellyfin.png';
import NavidromeLogo from './assets/navidrome.png';
import OpenSubsonicLogo from './assets/opensubsonic.png';

export interface AuthUserPermissions {
    'jukebox.manage': boolean; // Allow managing the jukebox
    'media.download': boolean; // Allow downloading media
    'media.folder': string[]; // Viewable folders
    'media.share': boolean; // Allow sharing media
    'media.stream': boolean; // Allow streaming media
    'media.upload': boolean; // Allow uploading media
    'playlist.create': boolean; // Allow creating playlists
    'playlist.delete': boolean; // Allow deleting playlists
    'playlist.edit': boolean; // Allow editing playlists
    'server.admin': boolean; // Allow managing the server (user management / server settings)
    'user.edit': boolean; // Allow editing own user account
}

export enum AlbumListSortOptions {
    ALBUM_ARTIST = 'albumArtist',
    ARTIST = 'artist',
    COMMUNITY_RATING = 'communityRating',
    CRITIC_RATING = 'criticRating',
    DATE_ADDED = 'dateAdded',
    DATE_PLAYED = 'datePlayed',
    DURATION = 'duration',
    IS_FAVORITE = 'isFavorite',
    NAME = 'name',
    PLAY_COUNT = 'playCount',
    RANDOM = 'random',
    RATING = 'rating',
    RELEASE_DATE = 'releaseDate',
    TRACK_COUNT = 'trackCount',
    YEAR = 'year',
}

export const AlbumListSortOptionsLabels = {
    [AlbumListSortOptions.ALBUM_ARTIST]: localize.t('app.albums.sort.albumArtist'),
    [AlbumListSortOptions.ARTIST]: localize.t('app.albums.sort.artist'),
    [AlbumListSortOptions.COMMUNITY_RATING]: localize.t('app.albums.sort.communityRating'),
    [AlbumListSortOptions.CRITIC_RATING]: localize.t('app.albums.sort.criticRating'),
    [AlbumListSortOptions.DATE_ADDED]: localize.t('app.albums.sort.dateAdded'),
    [AlbumListSortOptions.DATE_PLAYED]: localize.t('app.albums.sort.datePlayed'),
    [AlbumListSortOptions.DURATION]: localize.t('app.albums.sort.duration'),
    [AlbumListSortOptions.IS_FAVORITE]: localize.t('app.albums.sort.isFavorite'),
    [AlbumListSortOptions.NAME]: localize.t('app.albums.sort.name'),
    [AlbumListSortOptions.PLAY_COUNT]: localize.t('app.albums.sort.playCount'),
    [AlbumListSortOptions.RANDOM]: localize.t('app.albums.sort.random'),
    [AlbumListSortOptions.RATING]: localize.t('app.albums.sort.rating'),
    [AlbumListSortOptions.RELEASE_DATE]: localize.t('app.albums.sort.releaseDate'),
    [AlbumListSortOptions.TRACK_COUNT]: localize.t('app.albums.sort.trackCount'),
    [AlbumListSortOptions.YEAR]: localize.t('app.albums.sort.year'),
};

export enum ArtistListSortOptions {
    ALBUM_COUNT = 'albumCount',
    DURATION = 'duration',
    IS_FAVORITE = 'isFavorite',
    NAME = 'name',
    RANDOM = 'random',
    RATING = 'rating',
    TRACK_COUNT = 'trackCount',
}

export enum PlaylistListSortOptions {
    DURATION = 'duration',
    NAME = 'name',
    OWNER = 'owner',
    PUBLIC = 'public',
    TRACK_COUNT = 'trackCount',
    UPDATED_AT = 'updatedAt',
}

export enum TrackListSortOptions {
    ALBUM = 'album',
    ALBUM_ARTIST = 'albumArtist',
    ARTIST = 'artist',
    BPM = 'bpm',
    CHANNELS = 'channels',
    COMMENT = 'comment',
    DURATION = 'duration',
    GENRE = 'genre',
    ID = 'id',
    IS_FAVORITE = 'isFavorite',
    NAME = 'name',
    PLAY_COUNT = 'playCount',
    RANDOM = 'random',
    RATING = 'rating',
    RECENTLY_ADDED = 'recentlyAdded',
    RECENTLY_PLAYED = 'recentlyPlayed',
    RELEASE_DATE = 'releaseDate',
    YEAR = 'year',
}

export enum GenreListSortOptions {
    ALBUM_COUNT = 'albumCount',
    NAME = 'name',
    TRACK_COUNT = 'trackCount',
}

export enum LibraryListSortOptions {
    CREATED_AT = 'createdAt',
    NAME = 'name',
    TYPE = 'type',
    UPDATED_AT = 'updatedAt',
}

export enum UserListSortOptions {
    CREATED_AT = 'createdAt',
    DISPLAY_NAME = 'displayName',
    NAME = 'name',
    UPDATED_AT = 'updatedAt',
}

export enum ListSortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export enum PlaylistFolderListSortOptions {
    CREATED_AT = 'createdAt',
    NAME = 'name',
    UPDATED_AT = 'updatedAt',
}

export enum ServerType {
    OPENSUBSONIC = 'opensubsonic',
    JELLYFIN = 'jellyfin',
    NAVIDROME = 'navidrome',
}

export enum ServerItemType {
    ALBUM = 'album',
    ALBUM_ARTIST = 'albumArtist',
    ARTIST = 'artist',
    GENRE = 'genre',
    LIBRARY = 'library',
    PLAYLIST = 'playlist',
    PLAYLIST_TRACK = 'playlistTrack',
    QUEUE_TRACK = 'queueTrack',
    TRACK = 'track',
    USER = 'user',
}

export interface AuthServer {
    baseUrl: string;
    displayName: string;
    features: ServerFeatures;
    id: string;
    overrideBaseUrl?: string;
    overrideEnabled?: boolean;
    type: ServerType;
    user: {
        credential: string;
        username: string;
    } | null;
}

export interface AppServer {
    features: ServerFeatures;
    logo: any;
    name: string;
}

export interface AppServerConfig {
    [ServerType.JELLYFIN]: AppServer;
    [ServerType.NAVIDROME]: AppServer;
    [ServerType.OPENSUBSONIC]: AppServer;
}

export interface ServerFeatures {
    'album:detail': boolean;
    'album:detail:favorites': boolean;
    'album:detail:ratings': boolean;
    'album:list': boolean;
    'album:list:sort': AlbumListSortOptions[];
    'albumArtist:detail': boolean;
    'albumArtist:detail:favorites': boolean;
    'albumArtist:detail:ratings': boolean;
    'albumArtist:list': boolean;
    'albumArtist:list:sort': ArtistListSortOptions[];
    'artist:detail': boolean;
    'artist:detail:favorites': boolean;
    'artist:detail:ratings': boolean;
    'artist:list': boolean;
    'artist:list:sort': ArtistListSortOptions[];
    'genre:detail': boolean;
    'genre:list': boolean;
    'genre:list:sort': GenreListSortOptions[];
    'playlist:create': boolean;
    'playlist:delete': boolean;
    'playlist:detail': boolean;
    'playlist:list': boolean;
    'playlist:list:sort': PlaylistListSortOptions[];
    'track:detail': boolean;
    'track:detail:favorites': boolean;
    'track:detail:ratings': boolean;
    'track:list': boolean;
    'track:list:sort': TrackListSortOptions[];
}

export const SERVER_CONFIG: AppServerConfig = {
    [ServerType.JELLYFIN]: {
        features: {
            'album:detail': true,
            'album:detail:favorites': true,
            'album:detail:ratings': true,
            'album:list': true,
            'album:list:sort': [],
            'albumArtist:detail': true,
            'albumArtist:detail:favorites': true,
            'albumArtist:detail:ratings': true,
            'albumArtist:list': true,
            'albumArtist:list:sort': [],
            'artist:detail': true,
            'artist:detail:favorites': true,
            'artist:detail:ratings': true,
            'artist:list': true,
            'artist:list:sort': [],
            'genre:detail': true,
            'genre:list': true,
            'genre:list:sort': [],
            'playlist:create': true,
            'playlist:delete': true,
            'playlist:detail': true,
            'playlist:list': true,
            'playlist:list:sort': [],
            'track:detail': true,
            'track:detail:favorites': true,
            'track:detail:ratings': true,
            'track:list': true,
            'track:list:sort': [],
        },
        logo: JellyfinLogo,
        name: 'Jellyfin',
    },
    [ServerType.NAVIDROME]: {
        features: {
            'album:detail': true,
            'album:detail:favorites': true,
            'album:detail:ratings': true,
            'album:list': true,
            'album:list:sort': [],
            'albumArtist:detail': true,
            'albumArtist:detail:favorites': true,
            'albumArtist:detail:ratings': true,
            'albumArtist:list': true,
            'albumArtist:list:sort': [],
            'artist:detail': true,
            'artist:detail:favorites': true,
            'artist:detail:ratings': true,
            'artist:list': true,
            'artist:list:sort': [],
            'genre:detail': true,
            'genre:list': true,
            'genre:list:sort': [],
            'playlist:create': true,
            'playlist:delete': true,
            'playlist:detail': true,
            'playlist:list': true,
            'playlist:list:sort': [],
            'track:detail': true,
            'track:detail:favorites': true,
            'track:detail:ratings': true,
            'track:list': true,
            'track:list:sort': [],
        },
        logo: NavidromeLogo,
        name: 'Navidrome',
    },
    [ServerType.OPENSUBSONIC]: {
        features: {
            'album:detail': true,
            'album:detail:favorites': true,
            'album:detail:ratings': true,
            'album:list': true,
            'album:list:sort': [
                AlbumListSortOptions.DATE_ADDED,
                AlbumListSortOptions.DATE_PLAYED,
                AlbumListSortOptions.IS_FAVORITE,
                AlbumListSortOptions.NAME,
                AlbumListSortOptions.RATING,
                AlbumListSortOptions.PLAY_COUNT,
                AlbumListSortOptions.YEAR,
            ],
            'albumArtist:detail': true,
            'albumArtist:detail:favorites': true,
            'albumArtist:detail:ratings': true,
            'albumArtist:list': true,
            'albumArtist:list:sort': [
                ArtistListSortOptions.NAME,
                ArtistListSortOptions.ALBUM_COUNT,
                ArtistListSortOptions.TRACK_COUNT,
            ],
            'artist:detail': true,
            'artist:detail:favorites': true,
            'artist:detail:ratings': true,
            'artist:list': true,
            'artist:list:sort': [],
            'genre:detail': true,
            'genre:list': true,
            'genre:list:sort': [],
            'playlist:create': true,
            'playlist:delete': true,
            'playlist:detail': true,
            'playlist:list': true,
            'playlist:list:sort': [],
            'track:detail': true,
            'track:detail:favorites': true,
            'track:detail:ratings': true,
            'track:list': true,
            'track:list:sort': [],
        },
        logo: OpenSubsonicLogo,
        name: 'OpenSubsonic',
    },
};
