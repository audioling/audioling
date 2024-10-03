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
import { EmptyResponseSchema, schemaResponse } from '@/controllers/shared-api-types.js';
import {
    trackListRequestSchema,
    trackListResponseSchema,
} from '@/controllers/track/track-api-types.js';

export const albumArtistApiSchema = {
    '/': {
        get: {
            request: {
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
    '/{id}': {
        get: {
            request: {
                params: z.object({ id: z.string() }),
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
                params: z.object({ id: z.string() }),
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
    '/{id}/favorite': {
        delete: {
            request: {
                params: z.object({ id: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Remove album artist from favorites',
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
                {
                    description: 'Add album artist to favorites',
                    schema: EmptyResponseSchema,
                    status: 204,
                },
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
