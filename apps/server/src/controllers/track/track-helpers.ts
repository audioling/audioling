import { LibraryItemType } from '@repo/shared-types';
import type { AdapterTrack } from '@/adapters/types/adapter-track-types.js';
import type { TrackEntry } from '@/controllers/track/track-api-types.js';

export const trackHelpers = {
    adapterToResponse: (track: AdapterTrack, libraryId: string): TrackEntry => {
        return {
            ...track,
            itemType: LibraryItemType.TRACK,
            libraryId,
        };
    },
};
