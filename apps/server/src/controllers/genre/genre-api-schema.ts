import { z } from 'zod';
import {
    genreListRequestSchema,
    genreListResponseSchema,
    genreTrackListRequestSchema,
    genreTrackListResponseSchema,
} from '@/controllers/genre/genre-api-types.js';
import { CountResponseSchema, schemaResponse } from '@/controllers/shared-api-types.js';

export const genreApiSchema = {
    '/': {
        get: {
            request: {
                params: z.object({ libraryId: z.string() }),
                query: genreListRequestSchema,
            },
            responses: schemaResponse(
                { description: 'Get genres', schema: genreListResponseSchema, status: 200 },
                [401, 403, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/count': {
        get: {
            request: {
                params: z.object({ libraryId: z.string() }),
                query: genreListRequestSchema.omit({ limit: true, offset: true }),
            },
            responses: schemaResponse(
                { description: 'Get genres count', schema: CountResponseSchema, status: 200 },
                [401, 403, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/{id}/tracks': {
        get: {
            request: {
                params: z.object({ id: z.string(), libraryId: z.string() }),
                query: genreTrackListRequestSchema,
            },
            responses: schemaResponse(
                {
                    description: 'Get genre tracks',
                    schema: genreTrackListResponseSchema,
                    status: 200,
                },
                [401, 403, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/{id}/tracks/count': {
        get: {
            request: {
                params: z.object({ id: z.string(), libraryId: z.string() }),
                query: genreTrackListRequestSchema.omit({ limit: true, offset: true }),
            },
            responses: schemaResponse(
                { description: 'Get genre tracks count', schema: CountResponseSchema, status: 200 },
                [401, 403, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
};
