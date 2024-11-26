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
        token: string,
    ): PlaylistEntry => {
        return {
            ...playlist,
            imageUrl: controllerHelpers.getImageUrl(
                libraryId,
                playlist.id,
                LibraryItemType.PLAYLIST,
                token,
            ),
            itemType: LibraryItemType.PLAYLIST,
            libraryId,
            thumbHash,
        };
    },
    adapterTrackToResponse: (
        track: AdapterPlaylistTrack,
        libraryId: string,
        thumbHash: string | null,
        token: string,
    ): PlaylistTrackEntry => {
        return {
            ...track,
            imageUrl: controllerHelpers.getImageUrl(
                libraryId,
                track.id,
                LibraryItemType.TRACK,
                token,
            ),
            itemType: LibraryItemType.TRACK,
            libraryId,
            streamUrl: controllerHelpers.getStreamUrl(libraryId, track.id, token),
            thumbHash,
        };
    },
};
