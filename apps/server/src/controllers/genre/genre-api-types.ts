import {
    GenreListSortOptions,
    LibraryItemType,
    ListSortOrder,
    TrackListSortOptions,
} from '@repo/shared-types';
import { z } from 'zod';
import {
    createIndividualResponseSchema,
    createPaginatedResponseSchema,
    paginationQuery,
} from '@/controllers/shared-api-types.js';
import { trackAttributes } from '@/controllers/track/track-api-types.js';

export const genreAttributes = z.object({
    albumCount: z.number().nullable(),
    id: z.string(),
    itemType: z.literal(LibraryItemType.GENRE),
    libraryId: z.string(),
    name: z.string(),
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

export const genreTrackListRequestSchema = z.object({
    ...paginationQuery,
    id: z.string(),
    sortBy: z.nativeEnum(TrackListSortOptions),
    sortOrder: z.nativeEnum(ListSortOrder),
});

export const genreTrackListResponseSchema = createPaginatedResponseSchema({
    attributes: trackAttributes,
});

export type GenreTrackListResponse = z.infer<typeof genreTrackListResponseSchema>;

export const genreTrackListCountResponseSchema = z.number();

export type GenreTrackListCountResponse = z.infer<typeof genreTrackListCountResponseSchema>;
