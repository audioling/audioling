import { LibraryItemType } from '@repo/shared-types';
import type { AdapterGenre } from '@/adapters/types/adapter-genre-types.js';
import type { GenreEntry } from '@/controllers/genre/genre-api-types.js';

export const genreHelpers = {
    adapterToResponse: (genre: AdapterGenre, libraryId: string): GenreEntry => {
        return {
            ...genre,
            itemType: LibraryItemType.GENRE,
            libraryId,
        };
    },
};
