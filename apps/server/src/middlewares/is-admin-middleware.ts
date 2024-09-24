import { createMiddleware } from 'hono/factory';
import type { AuthVariables } from '@/middlewares/auth-middleware.js';
import { apiError } from '@/modules/error-handler/index.js';

export type IsAdminMiddlewareContext = {
    Variables: AuthVariables;
};

export const isAdminMiddleware = () => {
    return createMiddleware<IsAdminMiddlewareContext>(async (c, next) => {
        const user = c.get('user');

        if (!user.isAdmin) {
            throw new apiError.permissionDenied();
        }

        await next();
    });
};
