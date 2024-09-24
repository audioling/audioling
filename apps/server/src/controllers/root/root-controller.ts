import { createRoute } from '@hono/zod-openapi';
import packageJson from '@/../package.json';
import { CONSTANTS } from '@/constants.js';
import { apiSchema } from '@/controllers/index.js';
import type { PingResponse } from '@/controllers/root/root-api-types.js';
import { newHono } from '@/modules/hono/index.js';

// SECTION - Root Controller
export const initRootController = () => {
    const controller = newHono();
    const defaultOpenapiTags = ['Root'];

    // ANCHOR - GET /ping
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/ping',
            summary: 'Ping the server',
            tags: [...defaultOpenapiTags],
            ...apiSchema.root['/ping'].get,
        }),
        (c) => {
            const response: PingResponse = {
                name: CONSTANTS.BRAND_NAME,
                status: 'OK',
                version: packageJson.version,
            };

            return c.json(response, 200);
        },
    );

    return controller;
};

export type RootController = ReturnType<typeof initRootController>;
