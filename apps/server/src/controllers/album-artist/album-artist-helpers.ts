import { LibraryItemType } from '@repo/shared-types';
import type { AdapterArtist } from '@/adapters/types/adapter-artist-types.js';
import type { AlbumArtistEntry } from '@/controllers/album-artist/album-artist-api-types.js';

export const albumArtistHelpers = {
    adapterToResponse: (artist: AdapterArtist, libraryId: string): AlbumArtistEntry => {
        return {
            ...artist,
            itemType: LibraryItemType.ALBUM_ARTIST,
            libraryId: libraryId,
        };
    },
};
