import { LibraryItemType } from '@repo/shared-types';
import type { AdapterArtist } from '@/adapters/types/adapter-artist-types.js';
import type { AlbumArtistEntry } from '@/controllers/album-artist/album-artist-api-types.js';
import { controllerHelpers } from '@/controllers/controller-helpers.js';

export const albumArtistHelpers = {
    adapterToResponse: (
        artist: AdapterArtist,
        libraryId: string,
        token: string,
    ): AlbumArtistEntry => {
        return {
            ...artist,
            imageUrl: controllerHelpers.getImageUrl(artist.imageUrl, token),
            itemType: LibraryItemType.ALBUM_ARTIST,
            libraryId: libraryId,
        };
    },
};
