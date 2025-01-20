import { z } from '@hono/zod-openapi';
import {
    albumDetailResponseSchema,
    albumListRequestSchema,
    albumListResponseSchema,
} from '@/controllers/album/album-api-types.js';
import {
    CountResponseSchema,
    EmptyResponseSchema,
    schemaResponse,
} from '@/controllers/shared-api-types.js';
import {
    trackListRequestSchema,
    trackListResponseSchema,
} from '@/controllers/track/track-api-types.js';

export const albumApiSchema = {
    '/': {
        get: {
            request: {
                params: z.object({ libraryId: z.string() }),
                query: albumListRequestSchema,
            },
            responses: schemaResponse(
                { description: 'Get albums', schema: albumListResponseSchema, status: 200 },
                [401, 403, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/count': {
        get: {
            request: {
                params: z.object({ libraryId: z.string() }),
                query: albumListRequestSchema.omit({ limit: true, offset: true }),
            },
            responses: schemaResponse(
                { description: 'Get albums count', schema: CountResponseSchema, status: 200 },
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
                { description: 'Invalidate album count', schema: EmptyResponseSchema, status: 204 },
                [401, 403, 422, 500],
            ),
        },
    },
    '/favorite': {
        post: {
            request: {
                body: {
                    content: {
                        'application/json': {
                            schema: z.object({ ids: z.array(z.string()) }),
                        },
                    },
                },
                params: z.object({ libraryId: z.string() }),
            },
            responses: schemaResponse(
                { description: 'Add album favorites', schema: EmptyResponseSchema, status: 204 },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/unfavorite': {
        post: {
            request: {
                body: {
                    content: {
                        'application/json': {
                            schema: z.object({ ids: z.array(z.string()) }),
                        },
                    },
                },
                params: z.object({ libraryId: z.string() }),
            },
            responses: schemaResponse(
                { description: 'Remove album favorites', schema: EmptyResponseSchema, status: 204 },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/{id}': {
        get: {
            request: {
                params: z.object({ id: z.string(), libraryId: z.string() }),
            },
            responses: schemaResponse(
                { description: 'Get album by id', schema: albumDetailResponseSchema, status: 200 },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/{id}/tracks': {
        get: {
            request: {
                params: z.object({ id: z.string(), libraryId: z.string() }),
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
