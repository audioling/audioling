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
        thumbHash: string | null,
    ): PlaylistEntry => {
        return {
            ...playlist,
            imageUrl: controllerHelpers.getImageUrl(libraryId, playlist.id),
            itemType: LibraryItemType.PLAYLIST,
            libraryId,
            thumbHash,
        };
    },
    adapterTrackToResponse: (
        track: AdapterPlaylistTrack,
        libraryId: string,
        thumbHash: string | null,
    ): PlaylistTrackEntry => {
        return {
            ...track,
            imageUrl: controllerHelpers.getImageUrl(libraryId, track.id),
            itemType: LibraryItemType.TRACK,
            libraryId,
            thumbHash,
        };
    },
};
