import {
    genreListRequestSchema,
    genreListResponseSchema,
} from '@/controllers/genre/genre-api-types.js';
import { schemaResponse } from '@/controllers/shared-api-types.js';

export const genreApiSchema = {
    '/': {
        get: {
            request: {
                query: genreListRequestSchema,
            },
            responses: schemaResponse(
                { description: 'Get genres', schema: genreListResponseSchema, status: 200 },
                [401, 403, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
};
