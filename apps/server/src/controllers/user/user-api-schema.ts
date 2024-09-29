import { z } from '@hono/zod-openapi';
import { EmptyResponseSchema, schemaResponse } from '@/controllers/shared-api-types.js';
import {
    userDetailResponseSchema,
    userInsertSchema,
    userListRequestSchema,
    userListResponseSchema,
    userUpdateSchema,
} from '@/controllers/user/user-api-types.js';

export const userApiSchema = {
    '/': {
        get: {
            request: { query: userListRequestSchema },
            responses: schemaResponse(
                {
                    description: 'Get users',
                    schema: userListResponseSchema,
                    status: 200,
                },
                [401, 403, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
        post: {
            request: {
                body: { content: { 'application/json': { schema: userInsertSchema } } },
            },
            responses: schemaResponse(
                {
                    description: 'Create user',
                    schema: userDetailResponseSchema,
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
                    schema: userDetailResponseSchema,
                    status: 200,
                },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
        put: {
            request: {
                body: { content: { 'application/json': { schema: userUpdateSchema } } },
                params: z.object({ id: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Update user',
                    schema: userDetailResponseSchema,
                    status: 200,
                },
                [400, 401, 403, 404, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
};
