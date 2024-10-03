import { z } from '@hono/zod-openapi';
import {
    albumDetailResponseSchema,
    albumListRequestSchema,
    albumListResponseSchema,
} from '@/controllers/album/album-api-types.js';
import { EmptyResponseSchema, schemaResponse } from '@/controllers/shared-api-types.js';
import {
    trackListRequestSchema,
    trackListResponseSchema,
} from '@/controllers/track/track-api-types.js';

export const albumApiSchema = {
    '/': {
        get: {
            request: {
                query: albumListRequestSchema,
            },
            responses: schemaResponse(
                { description: 'Get albums', schema: albumListResponseSchema, status: 200 },
                [401, 403, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/{id}': {
        get: {
            request: {
                params: z.object({ id: z.string() }),
            },
            responses: schemaResponse(
                { description: 'Get album by id', schema: albumDetailResponseSchema, status: 200 },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/{id}/favorite': {
        delete: {
            request: {
                params: z.object({ id: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Remove album from favorites',
                    schema: EmptyResponseSchema,
                    status: 204,
                },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
        post: {
            request: {
                params: z.object({ id: z.string() }),
            },
            responses: schemaResponse(
                { description: 'Add album to favorites', schema: EmptyResponseSchema, status: 204 },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/{id}/tracks': {
        get: {
            request: {
                params: z.object({ id: z.string() }),
                query: trackListRequestSchema,
            },
            responses: schemaResponse(
                {
                    description: 'Get album tracks',
                    schema: trackListResponseSchema,
                    status: 200,
                },
                [401, 403, 404, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
};
