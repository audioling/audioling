import { z } from '@hono/zod-openapi';
import {
    albumListRequestSchema,
    albumListResponseSchema,
} from '@/controllers/album/album-api-types.js';
import {
    albumArtistDetailResponseSchema,
    albumArtistListRequestSchema,
    albumArtistListResponseSchema,
} from '@/controllers/album-artist/album-artist-api-types.js';
import {
    CountResponseSchema,
    EmptyResponseSchema,
    schemaResponse,
} from '@/controllers/shared-api-types.js';
import {
    trackListRequestSchema,
    trackListResponseSchema,
} from '@/controllers/track/track-api-types.js';

export const albumArtistApiSchema = {
    '/': {
        get: {
            request: {
                params: z.object({ libraryId: z.string() }),
                query: albumArtistListRequestSchema,
            },
            responses: schemaResponse(
                {
                    description: 'Get album artists',
                    schema: albumArtistListResponseSchema,
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
                query: albumArtistListRequestSchema.omit({ limit: true, offset: true }),
            },
            responses: schemaResponse(
                {
                    description: 'Get album artists count',
                    schema: CountResponseSchema,
                    status: 200,
                },
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
                {
                    description: 'Invalidate album artist count',
                    schema: EmptyResponseSchema,
                    status: 204,
                },
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
                {
                    description: 'Add album artist favorites',
                    schema: EmptyResponseSchema,
                    status: 204,
                },
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
                {
                    description: 'Remove album artist favorites',
                    schema: EmptyResponseSchema,
                    status: 204,
                },
                [401, 403, 404, 500],
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
                    description: 'Get album artist by id',
                    schema: albumArtistDetailResponseSchema,
                    status: 200,
                },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/{id}/albums': {
        get: {
            request: {
                params: z.object({ id: z.string(), libraryId: z.string() }),
                query: albumListRequestSchema,
            },
            responses: schemaResponse(
                {
                    description: 'Get album artist albums',
                    schema: albumListResponseSchema,
                    status: 200,
                },
                [401, 403, 404, 422, 500],
            ),
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
                    description: 'Get album artist tracks',
                    schema: trackListResponseSchema,
                    status: 200,
                },
                [401, 403, 404, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
};
