import { GenreListSortOptions, LibraryItemType, ListSortOrder } from '@repo/shared-types';
import { z } from 'zod';
import {
    createIndividualResponseSchema,
    createPaginatedResponseSchema,
    paginationQuery,
} from '@/controllers/shared-api-types.js';

export const genreAttributes = z.object({
    albumCount: z.number().nullable(),
    id: z.string(),
    imageUrl: z.string(),
    itemType: z.literal(LibraryItemType.GENRE),
    libraryId: z.string(),
    name: z.string(),
    thumbHash: z.string().nullable(),
    trackCount: z.number().nullable(),
});

export type GenreEntry = z.infer<typeof genreAttributes>;

export const genreDetailResponseSchema = createIndividualResponseSchema({
    attributes: genreAttributes,
});

export type GenreDetailResponse = z.infer<typeof genreDetailResponseSchema>;

export const genreListRequestSchema = z.object({
    ...paginationQuery,
    folderId: z.string().array().optional(),
    searchTerm: z.string().optional(),
    sortBy: z.nativeEnum(GenreListSortOptions),
    sortOrder: z.nativeEnum(ListSortOrder),
});

export const genreListResponseSchema = createPaginatedResponseSchema({
    attributes: genreAttributes,
});

export type GenreListResponse = z.infer<typeof genreListResponseSchema>;
