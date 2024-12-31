import { LibraryItemType } from '@repo/shared-types';
import type {
    AdapterPlaylist,
    AdapterPlaylistTrack,
} from '@/adapters/types/adapter-playlist-types.js';
import { controllerHelpers } from '@/controllers/controller-helpers.js';
import type {
    PlaylistEntry,
    PlaylistTrackEntry,
} from '@/controllers/playlist/playlist-api-types.js';

export const playlistHelpers = {
    adapterToResponse: (
        playlist: AdapterPlaylist,
        libraryId: string,
        token: string,
    ): PlaylistEntry => {
        return {
            ...playlist,
            imageUrl: controllerHelpers.getImageUrl(playlist.imageUrl, token),
            itemType: LibraryItemType.PLAYLIST,
            libraryId,
        };
    },
    adapterTrackToResponse: (
        track: AdapterPlaylistTrack,
        libraryId: string,
        token: string,
    ): PlaylistTrackEntry => {
        return {
            ...track,
            imageUrl: track.imageUrl.map((url) => controllerHelpers.getImageUrl(url, token)),
            itemType: LibraryItemType.TRACK,
            libraryId,
            streamUrl: controllerHelpers.getStreamUrl(libraryId, track.id, token),
        };
    },
};
