import { z } from '@hono/zod-openapi';
import {
    EmptyResponseSchema,
    orderByQuery,
    paginationQuery,
    schemaResponse,
} from '@/controllers/shared-api-types.js';
import {
    UserDetailResponseSchema,
    UserInsertSchema,
    UserListResponseSchema,
    UserUpdateSchema,
} from '@/controllers/user/user-api-types.js';

export const userApiSchema = {
    '/': {
        get: {
            request: {
                query: z.object({
                    ...orderByQuery,
                    ...paginationQuery,
                }),
            },
            responses: schemaResponse(
                {
                    description: 'Get users',
                    schema: UserListResponseSchema,
                    status: 200,
                },
                [401, 403, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
        post: {
            request: {
                body: { content: { 'application/json': { schema: UserInsertSchema } } },
            },
            responses: schemaResponse(
                {
                    description: 'Create user',
                    schema: UserDetailResponseSchema,
                    status: 201,
                },
                [400, 401, 403, 409, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/{id}': {
        delete: {
            request: { params: z.object({ id: z.string() }) },
            responses: schemaResponse(
                {
                    description: 'Delete user',
                    schema: EmptyResponseSchema,
                    status: 204,
                },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
        get: {
            request: { params: z.object({ id: z.string() }) },
            responses: schemaResponse(
                {
                    description: 'Get user',
                    schema: UserDetailResponseSchema,
                    status: 200,
                },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
        put: {
            request: {
                body: { content: { 'application/json': { schema: UserUpdateSchema } } },
                params: z.object({ id: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Update user',
                    schema: UserDetailResponseSchema,
                    status: 200,
                },
                [400, 401, 403, 404, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
};
