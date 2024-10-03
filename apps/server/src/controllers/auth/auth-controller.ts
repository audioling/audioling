import { createRoute } from '@hono/zod-openapi';
import { apiSchema } from '@/controllers/index.js';
import { newHono } from '@/modules/hono/index.js';
import type { AppService } from '@/services';

// SECTION Auth Controller
export const initAuthController = (modules: {
    service: {
        auth: AppService['auth'];
        user: AppService['user'];
    };
}) => {
    const { service } = modules;

    const controller = newHono();
    const defaultOpenapiTags = ['Authentication'];

    // ANCHOR POST /sign-in
    controller.openapi(
        createRoute({
            method: 'post',
            path: '/sign-in',
            summary: 'Sign in',
            tags: [...defaultOpenapiTags],
            ...apiSchema.auth['/sign-in'].post,
        }),
        async (c) => {
            const body = c.req.valid('json');

            const { token, user } = await service.auth.signIn({
                password: body.password,
                username: body.username,
            });

            return c.json(
                {
                    data: {
                        createdAt: user.createdAt,
                        displayName: user.displayName,
                        enabled: user.isEnabled,
                        id: user.id,
                        isAdmin: user.isAdmin,
                        isEnabled: user.isEnabled,
                        token,
                        updatedAt: user.updatedAt,
                        username: user.username,
                    },
                    meta: {},
                },
                200,
            );
        },
    );

    // ANCHOR POST /sign-out
    controller.openapi(
        createRoute({
            method: 'post',
            path: '/sign-out',
            summary: 'Sign out',
            tags: [...defaultOpenapiTags],
            ...apiSchema.auth['/sign-out'].post,
        }),
        (c) => {
            return c.json(null, 200);
        },
    );

    // ANCHOR POST /register
    controller.openapi(
        createRoute({
            method: 'post',
            path: '/register',
            summary: 'Register',
            tags: [...defaultOpenapiTags],
            ...apiSchema.auth['/register'].post,
        }),
        async (c) => {
            const body = c.req.valid('json');

            await service.auth.register({
                password: body.password,
                username: body.username,
            });

            return c.json(null, 200);
        },
    );

    return controller;
};

export type AuthController = ReturnType<typeof initAuthController>;
