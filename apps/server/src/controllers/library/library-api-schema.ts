import { z } from '@hono/zod-openapi';
import {
    LibraryAuthRequestSchema,
    LibraryAuthResponseSchema,
    LibraryDetailResponseSchema,
    LibraryInsertSchema,
    LibraryListRequestSchema,
    LibraryListResponseSchema,
} from '@/controllers/library/library-api-types.js';
import { EmptyResponseSchema, schemaResponse } from '@/controllers/shared-api-types.js';

export const libraryApiSchema = {
    '/': {
        get: {
            request: { query: LibraryListRequestSchema },
            responses: schemaResponse(
                { description: 'Get libraries', schema: LibraryListResponseSchema, status: 200 },
                [401, 403, 404, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
        post: {
            request: {
                body: {
                    content: { 'application/json': { schema: LibraryInsertSchema } },
                },
            },
            responses: schemaResponse(
                {
                    description: 'Create a library',
                    schema: LibraryDetailResponseSchema,
                    status: 201,
                },
                [400, 401, 403, 404, 409, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/{id}': {
        delete: {
            request: {
                params: z.object({ id: z.string() }),
            },
            responses: schemaResponse(
                { description: 'Delete a library', schema: EmptyResponseSchema, status: 204 },
                [401, 403, 404, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
        get: {
            request: {
                params: z.object({ id: z.string() }),
            },
            responses: schemaResponse(
                { description: 'Get a library', schema: LibraryDetailResponseSchema, status: 200 },
                [401, 403, 404, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
        put: {
            request: {
                body: {
                    content: { 'application/json': { schema: LibraryInsertSchema } },
                },
                params: z.object({ id: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Update a library',
                    schema: LibraryDetailResponseSchema,
                    status: 200,
                },
                [400, 401, 403, 404, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/{id}/auth': {
        post: {
            request: {
                body: {
                    content: { 'application/json': { schema: LibraryAuthRequestSchema } },
                },
                params: z.object({ id: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Authenticate a library',
                    schema: LibraryAuthResponseSchema,
                    status: 200,
                },
                [400, 401, 403, 404, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
};
