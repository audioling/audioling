export enum LibraryType {
    JELLYFIN = 'JELLYFIN',
    NAVIDROME = 'NAVIDROME',
    SUBSONIC = 'SUBSONIC',
}

export enum LibraryItemType {
    ALBUM = 'album',
    ALBUM_ARTIST = 'albumArtist',
    ARTIST = 'artist',
    GENRE = 'genre',
    LIBRARY = 'library',
    PLAYLIST = 'playlist',
    TRACK = 'track',
    USER = 'user',
}

export type LibraryFeatures = {
    'album:detail': boolean;
    'album:detail:favorites': boolean;
    'album:detail:ratings': boolean;
    'album:list': boolean;
    'album:list:filter:albumArtist': boolean;
    'album:list:filter:artist': boolean;
    'album:list:filter:communityRating': boolean;
    'album:list:filter:criticRating': boolean;
    'album:list:filter:dateAdded': boolean;
    'album:list:filter:datePlayed': boolean;
    'album:list:filter:duration': boolean;
    'album:list:filter:isFavorite': boolean;
    'album:list:filter:name': boolean;
    'album:list:filter:playCount': boolean;
    'album:list:filter:random': boolean;
    'album:list:filter:rating': boolean;
    'album:list:filter:releaseDate': boolean;
    'album:list:filter:trackCount': boolean;
    'album:list:filter:year': boolean;
    'albumArtist:detail': boolean;
    'albumArtist:detail:favorites': boolean;
    'albumArtist:detail:ratings': boolean;
    'albumArtist:list': boolean;
    'albumArtist:list:filter:albumCount': boolean;
    'albumArtist:list:filter:duration': boolean;
    'albumArtist:list:filter:isFavorite': boolean;
    'albumArtist:list:filter:name': boolean;
    'albumArtist:list:filter:random': boolean;
    'albumArtist:list:filter:rating': boolean;
    'albumArtist:list:filter:trackCount': boolean;
    'artist:detail': boolean;
    'artist:detail:favorites': boolean;
    'artist:detail:ratings': boolean;
    'artist:list': boolean;
    'artist:list:filter:albumCount': boolean;
    'artist:list:filter:duration': boolean;
    'artist:list:filter:isFavorite': boolean;
    'artist:list:filter:name': boolean;
    'artist:list:filter:random': boolean;
    'artist:list:filter:rating': boolean;
    'artist:list:filter:trackCount': boolean;
    'genre:detail': boolean;
    'genre:list': boolean;
    'genre:list:filter:albumCount': boolean;
    'genre:list:filter:name': boolean;
    'genre:list:filter:trackCount': boolean;
    'playlist:create': boolean;
    'playlist:delete': boolean;
    'playlist:detail': boolean;
    'playlist:list': boolean;
    'playlist:list:filter:duration': boolean;
    'playlist:list:filter:name': boolean;
    'playlist:list:filter:owner': boolean;
    'playlist:list:filter:public': boolean;
    'playlist:list:filter:trackCount': boolean;
    'playlist:list:filter:updatedAt': boolean;
    'track:detail': boolean;
    'track:detail:favorites': boolean;
    'track:detail:ratings': boolean;
    'track:list': boolean;
    'track:list:filter:album': boolean;
    'track:list:filter:albumArtist': boolean;
    'track:list:filter:artist': boolean;
    'track:list:filter:bpm': boolean;
    'track:list:filter:channels': boolean;
    'track:list:filter:comment': boolean;
    'track:list:filter:duration': boolean;
    'track:list:filter:genre': boolean;
    'track:list:filter:id': boolean;
    'track:list:filter:name': boolean;
    'track:list:filter:playCount': boolean;
    'track:list:filter:rating': boolean;
    'track:list:filter:recentlyAdded': boolean;
    'track:list:filter:recentlyPlayed': boolean;
    'track:list:filter:releaseDate': boolean;
    'track:list:filter:year': boolean;
};

export type AuthUserPermissions = {
    'library:add': boolean;
    'library:edit': boolean;
    'library:remove': boolean;
    'user:add': boolean;
    'user:edit': boolean;
    'user:remove': boolean;
};

// Sync with LibraryFeatures[album][list][filter]
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

// Sync with LibraryFeatures[albumArtist][list][filter]
export enum ArtistListSortOptions {
    ALBUM_COUNT = 'albumCount',
    DURATION = 'duration',
    IS_FAVORITE = 'isFavorite',
    NAME = 'name',
    RANDOM = 'random',
    RATING = 'rating',
    TRACK_COUNT = 'trackCount',
}

// Sync with LibraryFeatures[playlist][list][filter]
export enum PlaylistListSortOptions {
    DURATION = 'duration',
    NAME = 'name',
    OWNER = 'owner',
    PUBLIC = 'public',
    TRACK_COUNT = 'trackCount',
    UPDATED_AT = 'updatedAt',
}

// Sync with LibraryFeatures[track][list][filter]
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

// Sync with LibraryFeatures[genre][list][filter]
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
