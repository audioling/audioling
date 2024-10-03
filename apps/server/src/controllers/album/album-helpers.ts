import { LibraryItemType } from '@repo/shared-types';
import type { AdapterAlbum } from '@/adapters/types/adapter-album-types.js';
import type { AlbumEntry } from '@/controllers/album/album-api-types.js';

export const albumHelpers = {
    adapterToResponse: (album: AdapterAlbum, libraryId: string): AlbumEntry => {
        return {
            ...album,
            itemType: LibraryItemType.ALBUM,
            libraryId: libraryId,
        };
    },
};
