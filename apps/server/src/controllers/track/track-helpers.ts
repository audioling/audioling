import { LibraryItemType } from '@repo/shared-types';
import type { AdapterTrack } from '@/adapters/types/adapter-track-types.js';
import { controllerHelpers } from '@/controllers/controller-helpers.js';
import type { TrackEntry } from '@/controllers/track/track-api-types.js';

export const trackHelpers = {
    adapterToResponse: (track: AdapterTrack, libraryId: string, token: string): TrackEntry => {
        return {
            ...track,
            imageUrl: track.imageUrl.map((url) => controllerHelpers.getImageUrl(url, token)),
            itemType: LibraryItemType.TRACK,
            libraryId,
            streamUrl: controllerHelpers.getStreamUrl(libraryId, track.id, token),
        };
    },
};
