export enum LibraryType {
    JELLYFIN = 'JELLYFIN',
    NAVIDROME = 'NAVIDROME',
    SUBSONIC = 'SUBSONIC',
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
                name: boolean;
                playCount: boolean;
                releaseDate: boolean;
                year: boolean;
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
                name: boolean;
                songCount: boolean;
            };
        };
    };
    song: {
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
