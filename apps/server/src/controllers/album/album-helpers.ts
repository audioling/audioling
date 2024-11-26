import { LibraryItemType } from '@repo/shared-types';
import type { AdapterAlbum } from '@/adapters/types/adapter-album-types.js';
import type { AlbumEntry } from '@/controllers/album/album-api-types.js';
import { controllerHelpers } from '@/controllers/controller-helpers.js';

export const albumHelpers = {
    adapterToResponse: (
        album: AdapterAlbum,
        libraryId: string,
        thumbHash: string | null,
        token: string,
    ): AlbumEntry => {
        return {
            ...album,
            imageUrl: controllerHelpers.getImageUrl(
                libraryId,
                album.id,
                LibraryItemType.ALBUM,
                token,
            ),
            itemType: LibraryItemType.ALBUM,
            libraryId,
            thumbHash,
        };
    },
};
