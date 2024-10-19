import { createRoute } from '@hono/zod-openapi';
import { stream } from 'hono/streaming';
import { apiSchema } from '@/controllers/index.js';
import type { AdapterVariables } from '@/middlewares/adapter-middleware.js';
import type { AuthVariables } from '@/middlewares/auth-middleware.js';
import { newHono } from '@/modules/hono/index.js';
import type { AppService } from '@/services/index.js';

type ImageRouterContext = {
    Variables: AuthVariables & AdapterVariables;
};

// SECTION - Image Controller
export const initImageController = (modules: { service: AppService }) => {
    const { service } = modules;

    const controller = newHono<ImageRouterContext>();
    const defaultOpenapiTags = ['Images'];

    // ANCHOR - GET /{id}
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/{id}',
            summary: 'Get image by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.image['/{id}'].get,
        }),
        async (c) => {
            const { id, libraryId } = c.req.valid('param');
            const { size, type } = c.req.valid('query');
            const { adapter } = c.var;

            c.header('Content-Type', 'image/jpeg');
            c.header('Content-Disposition', `inline`);

            const imageBuffer = await service.image.getCoverArtBuffer(adapter, {
                id,
                libraryId,
                size: size ? Number(size) : undefined,
                type,
            });

            return stream(c, async (stream) => {
                await stream.write(imageBuffer);
            });
        },
    );

    return controller;
};

export type ImageController = ReturnType<typeof initImageController>;
