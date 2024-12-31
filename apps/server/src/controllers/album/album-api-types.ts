import { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types';
import { LibraryItemType } from '@repo/shared-types';
import { z } from 'zod';
import {
    createIndividualResponseSchema,
    createPaginatedResponseSchema,
    paginationQuery,
    relatedArtist,
    relatedGenre,
} from '@/controllers/shared-api-types.js';

export const albumAttributes = z.object({
    artistId: z.string().nullable(),
    artists: relatedArtist.array(),
    comment: z.string().nullable(),
    createdDate: z.string(),
    description: z.string().nullable(),
    discTitles: z
        .object({
            disc: z.number(),
            title: z.string(),
        })
        .array(),
    duration: z.number().describe('Duration in seconds'),
    external: z.object({
        musicBrainzId: z.string().optional(),
    }),
    genres: relatedGenre.array(),
    id: z.string(),
    imageUrl: z.string(),
    isCompilation: z.boolean(),
    itemType: z.literal(LibraryItemType.ALBUM),
    libraryId: z.string(),
    moods: z
        .object({
            id: z.string(),
            name: z.string(),
        })
        .array(),
    name: z.string(),
    originalReleaseDate: z.string().nullable(),
    recordLabels: z
        .object({
            id: z.string(),
            name: z.string(),
        })
        .array(),
    releaseDate: z.string().nullable(),
    releaseTypes: z
        .object({
            id: z.string(),
            name: z.string(),
        })
        .array(),
    releaseYear: z.number().nullable(),
    size: z.number().nullable(),
    songCount: z.number().nullable(),
    sortName: z.string(),
    updatedDate: z.string().nullable(),
    userFavorite: z.boolean(),
    userFavoriteDate: z.string().nullable(),
    userLastPlayedDate: z.string().nullable(),
    userPlayCount: z.number().nullable(),
    userRating: z.number().nullable(),
    userRatingDate: z.string().nullable(),
});

export type AlbumEntry = z.infer<typeof albumAttributes>;

export const albumDetailResponseSchema = createIndividualResponseSchema({
    attributes: albumAttributes,
});

export type AlbumDetailResponse = z.infer<typeof albumDetailResponseSchema>;

export const albumListRequestSchema = z.object({
    ...paginationQuery,
    folderId: z.string().array().optional(),
    searchTerm: z.string().optional(),
    sortBy: z.nativeEnum(AlbumListSortOptions),
    sortOrder: z.nativeEnum(ListSortOrder),
});

export const albumListResponseSchema = createPaginatedResponseSchema({
    attributes: albumAttributes,
});

export type AlbumListResponse = z.infer<typeof albumListResponseSchema>;
