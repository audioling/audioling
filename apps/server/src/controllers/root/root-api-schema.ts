import { PingResponseSchema } from '@/controllers/root/root-api-types.js';

export const rootApiSchema = {
    '/ping': {
        get: {
            responses: {
                200: {
                    content: {
                        'application/json': {
                            schema: PingResponseSchema,
                        },
                    },
                    description: 'Ping the server',
                },
            },
        },
    },
};
