import { z } from 'zod';
import { imageDetailRequestSchema } from '@/controllers/image/image-api-types.js';
import { schemaResponse } from '@/controllers/shared-api-types.js';

export const imageApiSchema = {
    '/{id}': {
        get: {
            request: {
                params: z.object({ id: z.string(), libraryId: z.string() }),
                query: imageDetailRequestSchema,
            },
            responses: schemaResponse(
                { description: 'Get image by id', schema: z.string(), status: 200 },
                [401, 403, 404, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
};
