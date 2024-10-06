import { z } from '@hono/zod-openapi';
import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import {
    createIndividualResponseSchema,
    createPaginatedResponseSchema,
    paginationQuery,
    relatedArtist,
    relatedGenre,
} from '@/controllers/shared-api-types.js';

export const trackAttributes = z.object({
    album: z.string().nullable(),
    albumArtists: relatedArtist.array(),
    albumId: z.string().nullable(),
    artistId: z.string().nullable(),
    artistName: z.string().nullable(),
    artists: relatedArtist.array(),
    bitDepth: z.number().nullable(),
    bitRate: z.number().nullable(),
    bpm: z.number().nullable(),
    channelCount: z.number().nullable(),
    comment: z.string().nullable(),
    createdDate: z.string().nullable(),
    discNumber: z.string().nullable(),
    discSubtitle: z.string().nullable(),
    duration: z.number(),
    external: z.record(z.string(), z.unknown()),
    fileContainer: z.string().nullable(),
    fileName: z.string().nullable(),
    filePath: z.string().nullable(),
    fileSize: z.number().nullable(),
    genres: relatedGenre.array(),
    id: z.string(),
    imageUrl: z.string(),
    isCompilation: z.boolean(),
    itemType: z.literal(LibraryItemType.TRACK),
    libraryId: z.string(),
    name: z.string(),
    releaseYear: z.number().nullable(),
    rgAlbumGain: z.number().nullable(),
    rgAlbumPeak: z.number().nullable(),
    rgTrackGain: z.number().nullable(),
    rgTrackPeak: z.number().nullable(),
    sortName: z.string(),
    thumbHash: z.string().nullable(),
    trackNumber: z.number().nullable(),
    updatedDate: z.string().nullable(),
    userFavorite: z.boolean(),
    userFavoriteDate: z.string().nullable(),
    userLastPlayedDate: z.string().nullable(),
    userPlayCount: z.number(),
    userRating: z.number().nullable(),
});

export type TrackEntry = z.infer<typeof trackAttributes>;

export const trackDetailResponseSchema = createIndividualResponseSchema({
    attributes: trackAttributes,
});

export type TrackDetailResponse = z.infer<typeof trackDetailResponseSchema>;

export const trackListRequestSchema = z.object({
    ...paginationQuery,
    folderId: z.string().array().optional(),
    searchTerm: z.string().optional(),
    sortBy: z.nativeEnum(TrackListSortOptions),
    sortOrder: z.nativeEnum(ListSortOrder),
});

export const trackListResponseSchema = createPaginatedResponseSchema({
    attributes: trackAttributes,
});

export type TrackListResponse = z.infer<typeof trackListResponseSchema>;
