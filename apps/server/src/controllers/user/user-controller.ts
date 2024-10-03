import { createRoute } from '@hono/zod-openapi';
import { controllerHelpers } from '@/controllers/controller-helpers.js';
import { apiSchema } from '@/controllers/index.js';
import type { UserDetailResponse, UserListResponse } from '@/controllers/user/user-api-types.js';
import type { AuthVariables } from '@/middlewares/auth-middleware.js';
import { isAdminMiddleware } from '@/middlewares/is-admin-middleware.js';
import { isSelfMiddleware } from '@/middlewares/is-self-middleware.js';
import { newHono } from '@/modules/hono/index.js';
import type { AppService } from '@/services/index.js';

type UserRouterContext = {
    Variables: AuthVariables;
};

// SECTION - User Controller
export const initUserController = (modules: { service: AppService }) => {
    const { service } = modules;

    const controller = newHono<UserRouterContext>();
    const defaultOpenapiTags = ['Users'];

    // ANCHOR - GET /
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/',
            summary: 'Get all users',
            tags: [...defaultOpenapiTags],
            ...apiSchema.user['/'].get,
        }),
        async (c) => {
            const query = c.req.valid('query');

            const users = await service.user.list({
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
            });

            const response: UserListResponse = {
                data: users.data.map((user) => ({
                    createdAt: user.createdAt,
                    displayName: user.displayName,
                    id: user.id,
                    isAdmin: user.isAdmin,
                    isEnabled: user.isEnabled,
                    updatedAt: user.updatedAt,
                    username: user.username,
                })),
                meta: {
                    next: controllerHelpers.getIsNextPage(
                        users.offset,
                        users.limit,
                        users.totalRecordCount,
                    ),
                    prev: controllerHelpers.getIsPrevPage(users.offset, users.limit),
                    totalRecordCount: users.totalRecordCount,
                },
            };

            return c.json(response, 200);
        },
    );

    // ANCHOR - POST /
    controller.openapi(
        createRoute({
            method: 'post',
            middleware: [isAdminMiddleware()],
            path: '/',
            summary: 'Create user',
            tags: [...defaultOpenapiTags],
            ...apiSchema.user['/'].post,
        }),
        async (c) => {
            const body = c.req.valid('json');

            const user = await service.user.add({
                values: {
                    displayName: body.displayName || '',
                    isAdmin: false,
                    isEnabled: true,
                    password: body.password,
                    tokens: [],
                    username: body.username,
                },
            });

            const response: UserDetailResponse = {
                data: {
                    createdAt: user.createdAt,
                    displayName: user.displayName,
                    id: user.id,
                    isAdmin: user.isAdmin,
                    isEnabled: user.isEnabled,
                    updatedAt: user.updatedAt,
                    username: user.username,
                },
                meta: { self: c.req.url },
            };

            return c.json(response, 201);
        },
    );

    // ANCHOR - GET /{id}
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/{id}',
            summary: 'Get user by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.user['/{id}'].get,
        }),
        async (c) => {
            const params = c.req.param();

            const user = await service.user.detail({ id: params.id });

            const response: UserDetailResponse = {
                data: user,
                meta: { self: c.req.url },
            };

            return c.json(response, 200);
        },
    );

    // ANCHOR - DELETE /{id}
    controller.openapi(
        createRoute({
            method: 'delete',
            middleware: [isSelfMiddleware()],
            path: '/{id}',
            summary: 'Delete user by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.user['/{id}'].delete,
        }),
        async (c) => {
            const params = c.req.param();

            await service.user.remove({ id: params.id });

            return c.json(null, 204);
        },
    );

    // ANCHOR - PUT /{id}
    controller.openapi(
        createRoute({
            method: 'put',
            middleware: [isSelfMiddleware()],
            path: '/{id}',
            summary: 'Update user by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.user['/{id}'].put,
        }),
        async (c) => {
            const params = c.req.valid('param');
            const body = c.req.valid('json');

            const user = await service.user.update({
                id: params.id,
                values: {
                    displayName: body.displayName,
                    isAdmin: body.isAdmin,
                    isEnabled: body.isEnabled,
                    password: body.password,
                    username: body.username,
                },
            });

            const response: UserDetailResponse = {
                data: user,
                meta: { self: c.req.url },
            };

            return c.json(response, 200);
        },
    );

    return controller;
};

export type UserController = ReturnType<typeof initUserController>;
