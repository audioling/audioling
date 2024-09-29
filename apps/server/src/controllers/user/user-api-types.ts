import { z } from '@hono/zod-openapi';
import { ListSortOrder, UserListSortOptions } from '@repo/shared-types';
import {
    createIndividualResponseSchema,
    createPaginatedResponseSchema,
    paginationQuery,
} from '@/controllers/shared-api-types.js';

export const UserAttributes = z.object({
    createdAt: z.string().or(z.date()).openapi({ example: '2020-01-01T00:00:00.000Z' }),
    displayName: z.string().nullable().openapi({ example: 'Admin' }),
    id: z.string().openapi({ example: 'admin' }).openapi({ example: 'n3ke0qiq8orel17hxpquadj6' }),
    isAdmin: z.boolean().openapi({ example: true }),
    isEnabled: z.boolean().openapi({ example: true }),
    updatedAt: z.string().or(z.date()).openapi({ example: '2020-01-01T00:00:00.000Z' }),
    username: z.string().openapi({ example: 'admin' }),
});

export const userDetailResponseSchema = createIndividualResponseSchema({
    attributes: UserAttributes,
});

export type UserDetailResponse = z.infer<typeof userDetailResponseSchema>;

export const userInsertSchema = z.object({
    displayName: z.string().optional(),
    isAdmin: z.boolean().optional(),
    isEnabled: z.boolean().optional(),
    password: z.string(),
    username: z.string(),
});

export const userListRequestSchema = z.object({
    ...paginationQuery,
    sortBy: z.nativeEnum(UserListSortOptions),
    sortOrder: z.nativeEnum(ListSortOrder),
});

export const UserListParameters = z.object({
    limit: z.number().min(1).max(100),
    offset: z.number().min(0),
});

export const userListResponseSchema = createPaginatedResponseSchema({
    attributes: UserAttributes,
});

export type UserListResponse = z.infer<typeof userListResponseSchema>;

export const userUpdateSchema = userInsertSchema.partial();
