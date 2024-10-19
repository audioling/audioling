import { z } from '@hono/zod-openapi';
import {
    LibraryItemType,
    ListSortOrder,
    PlaylistListSortOptions,
    TrackListSortOptions,
} from '@repo/shared-types';
import {
    createIndividualResponseSchema,
    createPaginatedResponseSchema,
    paginationQuery,
    relatedGenre,
} from '@/controllers/shared-api-types.js';
import { trackAttributes } from '@/controllers/track/track-api-types.js';

export const playlistAttributes = z.object({
    createdDate: z.string(),
    description: z.string().nullable(),
    duration: z.number().nullable(),
    genres: relatedGenre.array(),
    id: z.string(),
    imageUrl: z.string().nullable(),
    isPublic: z.boolean(),
    itemType: z.literal(LibraryItemType.PLAYLIST),
    libraryId: z.string(),
    name: z.string(),
    owner: z.string().nullable(),
    ownerId: z.string().nullable(),
    size: z.number().nullable(),
    thumbHash: z.string().nullable(),
    trackCount: z.number().nullable(),
    updatedDate: z.string(),
});

export type PlaylistEntry = z.infer<typeof playlistAttributes>;

export const playlistDetailResponseSchema = createIndividualResponseSchema({
    attributes: playlistAttributes,
});

export type PlaylistDetailResponse = z.infer<typeof playlistDetailResponseSchema>;

export const playlistListRequestSchema = z.object({
    ...paginationQuery,
    folderId: z.string().array().optional(),
    searchTerm: z.string().optional(),
    sortBy: z.nativeEnum(PlaylistListSortOptions),
    sortOrder: z.nativeEnum(ListSortOrder),
});

export const playlistListResponseSchema = createPaginatedResponseSchema({
    attributes: playlistAttributes,
});

export type PlaylistListResponse = z.infer<typeof playlistListResponseSchema>;

export const playlistDetailTrackListRequestSchema = z.object({
    ...paginationQuery,
    sortBy: z.nativeEnum(TrackListSortOptions),
    sortOrder: z.nativeEnum(ListSortOrder),
});

export const playlistDetailTrackListResponseSchema = createPaginatedResponseSchema({
    attributes: trackAttributes.extend({
        playlistTrackId: z.string(),
    }),
});

export type PlaylistDetailTrackListResponse = z.infer<typeof playlistDetailTrackListResponseSchema>;

export const playlistTrackAttributes = trackAttributes.extend({
    playlistTrackId: z.string(),
});

export type PlaylistTrackEntry = z.infer<typeof playlistTrackAttributes>;
