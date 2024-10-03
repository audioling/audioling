import { z } from '@hono/zod-openapi';
import { EmptyResponseSchema, schemaResponse } from '@/controllers/shared-api-types.js';
import {
    trackDetailResponseSchema,
    trackListRequestSchema,
    trackListResponseSchema,
} from '@/controllers/track/track-api-types.js';

export const trackApiSchema = {
    '/': {
        get: {
            request: {
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
    '/{id}': {
        get: {
            request: {
                params: z.object({ id: z.string() }),
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
                params: z.object({ id: z.string() }),
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
                params: z.object({ id: z.string() }),
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
};
