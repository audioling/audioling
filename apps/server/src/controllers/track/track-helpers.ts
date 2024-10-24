import { LibraryItemType } from '@repo/shared-types';
import type { AdapterTrack } from '@/adapters/types/adapter-track-types.js';
import { controllerHelpers } from '@/controllers/controller-helpers.js';
import type { TrackEntry } from '@/controllers/track/track-api-types.js';

export const trackHelpers = {
    adapterToResponse: (
        track: AdapterTrack,
        libraryId: string,
        thumbHash: string | null,
    ): TrackEntry => {
        return {
            ...track,
            imageUrl: controllerHelpers.getImageUrl(libraryId, track.id, LibraryItemType.TRACK),
            itemType: LibraryItemType.TRACK,
            libraryId,
            thumbHash,
        };
    },
};
