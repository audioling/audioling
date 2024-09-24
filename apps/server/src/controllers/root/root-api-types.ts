import { z } from '@hono/zod-openapi';

export const PingResponseSchema = z.object({
    name: z.string().openapi({ example: 'audioling' }),
    status: z.string().openapi({ example: 'OK' }),
    version: z.string().openapi({ example: '1.0.0' }),
});

export type PingResponse = z.infer<typeof PingResponseSchema>;
