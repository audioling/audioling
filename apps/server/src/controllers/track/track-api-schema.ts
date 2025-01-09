import { z } from '@hono/zod-openapi';
import {
    CountResponseSchema,
    EmptyResponseSchema,
    schemaResponse,
} from '@/controllers/shared-api-types.js';
import {
    trackDetailResponseSchema,
    trackListRequestSchema,
    trackListResponseSchema,
} from '@/controllers/track/track-api-types.js';

export const trackApiSchema = {
    '/': {
        get: {
            request: {
                params: z.object({ libraryId: z.string() }),
                query: trackListRequestSchema,
            },
            responses: schemaResponse(
                {
                    description: 'Get tracks',
                    schema: trackListResponseSchema,
                    status: 200,
                },
                [401, 403, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/count': {
        get: {
            request: {
                params: z.object({ libraryId: z.string() }),
                query: trackListRequestSchema.omit({ limit: true, offset: true }),
            },
            responses: schemaResponse(
                { description: 'Get tracks count', schema: CountResponseSchema, status: 200 },
                [401, 403, 422, 500],
            ),
        },
    },
    '/count/invalidate': {
        post: {
            request: {
                params: z.object({ libraryId: z.string() }),
            },
            responses: schemaResponse(
                { description: 'Invalidate track count', schema: EmptyResponseSchema, status: 204 },
                [401, 403, 422, 500],
            ),
        },
    },
    '/{id}': {
        get: {
            request: {
                params: z.object({ id: z.string(), libraryId: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Get track by id',
                    schema: trackDetailResponseSchema,
                    status: 200,
                },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/{id}/favorite': {
        delete: {
            request: {
                params: z.object({ id: z.string(), libraryId: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Remove track favorite by id',
                    schema: EmptyResponseSchema,
                    status: 204,
                },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
        post: {
            request: {
                params: z.object({ id: z.string(), libraryId: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Add track favorite by id',
                    schema: EmptyResponseSchema,
                    status: 204,
                },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/{id}/stream': {
        get: {
            request: {
                params: z.object({ id: z.string(), libraryId: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Get track stream by id',
                    schema: EmptyResponseSchema,
                    status: 200,
                },
                [401, 403, 404, 500],
            ),
        },
    },
};
