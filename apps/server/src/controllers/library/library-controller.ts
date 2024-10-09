import { createRoute } from '@hono/zod-openapi';
import type { LibraryType } from '@repo/shared-types';
import { controllerHelpers } from '@/controllers/controller-helpers.js';
import { apiSchema } from '@/controllers/index.js';
import type {
    LibraryAuthResponse,
    LibraryDetailResponse,
    LibraryListResponse,
} from '@/controllers/library/library-api-types.js';
import type { AuthVariables } from '@/middlewares/auth-middleware.js';
import { isAdminMiddleware } from '@/middlewares/is-admin-middleware.js';
import { newHono } from '@/modules/hono/index.js';
import type { AppService } from '@/services/index.js';

type LibraryRouterContext = {
    Variables: AuthVariables;
};

// SECTION - Library Controller
export const initLibraryController = (modules: { service: AppService }) => {
    const { service } = modules;

    const controller = newHono<LibraryRouterContext>();
    const defaultOpenapiTags = ['Libraries'];

    // ANCHOR - GET /
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/',
            summary: 'Get all libraries',
            tags: [...defaultOpenapiTags],
            ...apiSchema.library['/'].get,
        }),
        async (c) => {
            const query = c.req.valid('query');

            const libraries = await service.library.list({
                limit: query.limit ? Number(query.limit) : undefined,
                offset: query.offset ? Number(query.offset) : undefined,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
            });

            const response: LibraryListResponse = {
                data: libraries.data.map((library) => ({
                    baseUrl: library.baseUrl,
                    createdAt: library.createdAt,
                    displayName: library.displayName || library.baseUrl,
                    folders: library.folders,
                    id: library.id,
                    type: library.type,
                    updatedAt: library.updatedAt,
                })),
                meta: {
                    next: controllerHelpers.getIsNextPage(
                        libraries.offset,
                        libraries.limit,
                        libraries.totalRecordCount,
                    ),
                    prev: controllerHelpers.getIsPrevPage(libraries.offset, libraries.limit),
                    totalRecordCount: libraries.totalRecordCount,
                },
            };

            return c.json(response, 200);
        },
    );

    // ANCHOR - POST /
    controller.openapi(
        createRoute({
            description: 'Create a library',
            method: 'post',
            middleware: [isAdminMiddleware()],
            path: '/',
            summary: 'Create library',
            tags: [...defaultOpenapiTags],
            ...apiSchema.library['/'].post,
        }),
        async (c) => {
            const body = c.req.valid('json');

            const library = await service.library.add({
                password: body.password,
                username: body.username,
                values: {
                    baseUrl: body.baseUrl,
                    displayName: body.displayName,
                    type: body.type as LibraryType,
                },
            });

            const response: LibraryDetailResponse = {
                data: {
                    baseUrl: library.baseUrl,
                    createdAt: library.createdAt,
                    displayName: library.displayName || library.baseUrl,
                    folders: library.folders,
                    id: library.id,
                    type: library.type,
                    updatedAt: library.updatedAt,
                },
                meta: {},
            };

            return c.json(response, 201);
        },
    );

    // ANCHOR - GET /{id}
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/{id}',
            summary: 'Get library by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.library['/{id}'].get,
        }),
        async (c) => {
            const library = await service.library.detail({ id: c.req.param('id') });

            const response: LibraryDetailResponse = {
                data: {
                    baseUrl: library.baseUrl,
                    createdAt: library.createdAt,
                    displayName: library.displayName || library.baseUrl,
                    folders: library.folders,
                    id: library.id,
                    type: library.type,
                    updatedAt: library.updatedAt,
                },
                meta: {},
            };

            return c.json(response, 200);
        },
    );

    // ANCHOR - PUT /{id}
    controller.openapi(
        createRoute({
            description: 'Update a library',
            method: 'put',
            middleware: [isAdminMiddleware()],
            path: '/{id}',
            summary: 'Update library by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.library['/{id}'].put,
        }),
        async (c) => {
            const body = c.req.valid('json');

            const library = await service.library.update({
                id: c.req.param('id'),
                values: {
                    baseUrl: body.baseUrl,
                    displayName: body.displayName,
                    type: body.type as LibraryType,
                },
            });

            const response: LibraryDetailResponse = {
                data: {
                    baseUrl: library.baseUrl,
                    createdAt: library.createdAt,
                    displayName: library.displayName || library.baseUrl,
                    folders: library.folders,
                    id: library.id,
                    type: library.type,
                    updatedAt: library.updatedAt,
                },
                meta: {},
            };

            return c.json(response, 200);
        },
    );

    // ANCHOR - DELETE /{id}
    controller.openapi(
        createRoute({
            method: 'delete',
            middleware: [isAdminMiddleware()],
            path: '/{id}',
            summary: 'Delete library by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.library['/{id}'].delete,
        }),
        async (c) => {
            await service.library.remove({ id: c.req.param('id') });
            return c.json(null, 204);
        },
    );

    // ANCHOR - POST /{id}/auth
    controller.openapi(
        createRoute({
            method: 'post',
            path: '/{id}/auth',
            summary: 'Authenticate library by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.library['/{id}/auth'].post,
        }),
        async (c) => {
            const body = c.req.valid('json');

            const authResult = await service.library.authenticate({
                body: {
                    password: body.password,
                    username: body.username,
                },
                id: c.req.param('id'),
            });

            const response: LibraryAuthResponse = {
                data: {
                    credential: authResult.credential,
                    username: authResult.username,
                },
                meta: {},
            };

            return c.json(response, 200);
        },
    );

    return controller;
};

export type LibraryController = ReturnType<typeof initLibraryController>;
