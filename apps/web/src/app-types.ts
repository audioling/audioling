import type {
    AdapterAlbum,
    AdapterArtist,
    AdapterGenre,
    AdapterPlaylist,
    AdapterPlaylistTrack,
    AdapterTrack,
} from '@repo/shared-types/adapter-types';

export interface AlbumItem extends AdapterAlbum {
    _serverId: string;
}

export interface AlbumArtistItem extends AdapterArtist {
    _serverId: string;
}

export interface ArtistItem extends AdapterArtist {
    _serverId: string;
}

export interface GenreItem extends AdapterGenre {
    _serverId: string;
}

export interface PlaylistItem extends AdapterPlaylist {
    _serverId: string;
}

export interface PlaylistTrackItem extends AdapterPlaylistTrack {
    _serverId: string;
}

export interface TrackItem extends AdapterTrack {
    _serverId: string;
}

export interface PlayQueueItem extends TrackItem {
    _uniqueId: string;
}

export const apiHelpers = {
    transform: <TData, TAddition extends { _serverId: string }>(data: TData, extra: TAddition) => {
        return {
            ...data,
            ...extra,
        };
    },
};
