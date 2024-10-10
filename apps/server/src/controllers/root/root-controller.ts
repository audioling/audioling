import { createRoute } from '@hono/zod-openapi';
import { ListSortOrder, UserListSortOptions } from '@repo/shared-types';
import packageJson from '@/../package.json';
import { CONSTANTS } from '@/constants.js';
import { apiSchema } from '@/controllers/index.js';
import type { PingResponse } from '@/controllers/root/root-api-types.js';
import { newHono } from '@/modules/hono/index.js';
import type { AppService } from '@/services/index.js';

// SECTION - Root Controller
export const initRootController = (modules: { service: AppService }) => {
    const { service } = modules;

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
        async (c) => {
            const users = await service.user.list({
                sortBy: UserListSortOptions.NAME,
                sortOrder: ListSortOrder.ASC,
            });

            const isSetupComplete = users.totalRecordCount > 0;

            const response: PingResponse = {
                isSetupComplete,
                name: CONSTANTS.APP_NAME,
                status: 'OK',
                version: packageJson.version,
            };

            return c.json(response, 200);
        },
    );

    return controller;
};

export type RootController = ReturnType<typeof initRootController>;
