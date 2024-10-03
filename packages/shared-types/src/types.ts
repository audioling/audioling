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
    album: {
        detail: {
            enabled: boolean;
        };
        list: {
            enabled: boolean;
            filter: {
                albumArtist: boolean;
                artist: boolean;
                communityRating: boolean;
                criticRating: boolean;
                dateAdded: boolean;
                datePlayed: boolean;
                duration: boolean;
                isFavorite: boolean;
                name: boolean;
                playCount: boolean;
                random: boolean;
                releaseDate: boolean;
                songCount: boolean;
                year: boolean;
            };
        };
    };
    albumArtist: {
        detail: {
            enabled: boolean;
        };
        list: {
            enabled: boolean;
            filter: {
                album: boolean;
                albumCount: boolean;
                dateAdded: boolean;
                duration: boolean;
                favorited: boolean;
                name: boolean;
                playCount: boolean;
                random: boolean;
                rating: boolean;
                releaseDate: boolean;
                songCount: boolean;
            };
        };
    };
    playlist: {
        create: boolean;
        delete: boolean;
        detail: {
            enabled: boolean;
            update: boolean;
        };
        list: {
            enabled: boolean;
            filter: {
                duration: boolean;
                name: boolean;
                owner: boolean;
                public: boolean;
                songCount: boolean;
                updatedAt: boolean;
            };
        };
    };
    track: {
        detail: {
            enabled: boolean;
            topSongList: boolean;
        };
        list: {
            enabled: boolean;
            filter: {
                album: boolean;
                albumArtist: boolean;
                artist: boolean;
                bpm: boolean;
                channels: boolean;
                comment: boolean;
                duration: boolean;
                genre: boolean;
                id: boolean;
                name: boolean;
                playCount: boolean;
                rating: boolean;
                releaseDate: boolean;
                year: boolean;
            };
        };
    };
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
    RELEASE_DATE = 'releaseDate',
    SONG_COUNT = 'songCount',
    YEAR = 'year',
}

// Sync with LibraryFeatures[albumArtist][list][filter]
export enum ArtistListSortOptions {
    ALBUM = 'album',
    ALBUM_COUNT = 'albumCount',
    DATE_ADDED = 'dateAdded',
    DURATION = 'duration',
    IS_FAVORITE = 'isFavorite',
    NAME = 'name',
    PLAY_COUNT = 'playCount',
    RANDOM = 'random',
    RATING = 'rating',
    RELEASE_DATE = 'releaseDate',
    SONG_COUNT = 'songCount',
}

// Sync with LibraryFeatures[playlist][list][filter]
export enum PlaylistListSortOptions {
    DURATION = 'duration',
    NAME = 'name',
    OWNER = 'owner',
    PUBLIC = 'public',
    SONG_COUNT = 'songCount',
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
