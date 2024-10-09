import { z } from '@hono/zod-openapi';
import { LibraryListSortOptions, LibraryType, ListSortOrder } from '@repo/shared-types';
import {
    createIndividualResponseSchema,
    createPaginatedResponseSchema,
    paginationQuery,
} from '@/controllers/shared-api-types.js';

export const LibraryAttributes = z.object({
    baseUrl: z.string(),
    createdAt: z.string(),
    displayName: z.string(),
    folders: z
        .object({
            id: z.string(),
            name: z.string(),
        })
        .array(),
    id: z.string(),
    type: z.nativeEnum(LibraryType),
    updatedAt: z.string(),
});

export const LibraryInsertSchema = z.object({
    baseUrl: z.string(),
    displayName: z.string(),
    isPublic: z.boolean().optional(),
    password: z.string(),
    type: z.nativeEnum(LibraryType),
    username: z.string(),
});

export const LibraryDetailResponseSchema = createIndividualResponseSchema({
    attributes: LibraryAttributes,
});

export type LibraryDetailResponse = z.infer<typeof LibraryDetailResponseSchema>;

export const LibraryListRequestSchema = z.object({
    ...paginationQuery,
    sortBy: z.nativeEnum(LibraryListSortOptions),
    sortOrder: z.nativeEnum(ListSortOrder),
});

export const LibraryListResponseSchema = createPaginatedResponseSchema({
    attributes: LibraryAttributes,
});

export type LibraryListResponse = z.infer<typeof LibraryListResponseSchema>;

export const LibraryFullScanSchema = z.object({
    folderId: z.string().array().optional(),
});

export const LibraryRefreshRequestSchema = z.object({});

export const LibraryAuthRequestSchema = z.object({
    baseUrl: z.string().optional(),
    password: z.string(),
    username: z.string(),
});

export type LibraryAuthRequest = z.infer<typeof LibraryAuthRequestSchema>;

export const LibraryAuthResponseSchema = createIndividualResponseSchema({
    attributes: z.object({
        credential: z.string(),
        username: z.string(),
    }),
});

export type LibraryAuthResponse = z.infer<typeof LibraryAuthResponseSchema>;
