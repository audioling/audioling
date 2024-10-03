import { z } from '@hono/zod-openapi';
import { ArtistListSortOptions, LibraryItemType, ListSortOrder } from '@repo/shared-types';
import {
    createIndividualResponseSchema,
    createPaginatedResponseSchema,
    paginationQuery,
    relatedGenre,
} from '@/controllers/shared-api-types.js';

export const albumArtistAttributes = z.object({
    albumCount: z.number().nullable(),
    biography: z.string().nullable(),
    createdDate: z.string().nullable(),
    duration: z.number().nullable(),
    external: z.object({
        musicBrainzId: z.string().optional(),
    }),
    genres: relatedGenre.array(),
    id: z.string(),
    itemType: z.nativeEnum(LibraryItemType),
    libraryId: z.string(),
    name: z.string(),
    songCount: z.number().nullable(),
    updatedDate: z.string().nullable(),
    userFavorite: z.boolean(),
    userFavoriteDate: z.string().nullable(),
    userLastPlayedDate: z.string().nullable(),
    userRating: z.number().nullable(),
    userRatingDate: z.string().nullable(),
});

export type AlbumArtistEntry = z.infer<typeof albumArtistAttributes>;

export const albumArtistDetailResponseSchema = createIndividualResponseSchema({
    attributes: albumArtistAttributes,
});

export type AlbumArtistDetailResponse = z.infer<typeof albumArtistDetailResponseSchema>;

export const albumArtistListRequestSchema = z.object({
    ...paginationQuery,
    folderId: z.string().array().optional(),
    searchTerm: z.string().optional(),
    sortBy: z.nativeEnum(ArtistListSortOptions),
    sortOrder: z.nativeEnum(ListSortOrder),
});

export const albumArtistListResponseSchema = createPaginatedResponseSchema({
    attributes: albumArtistAttributes,
});

export type AlbumArtistListResponse = z.infer<typeof albumArtistListResponseSchema>;
