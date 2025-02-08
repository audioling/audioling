import { createMiddleware } from 'hono/factory';
import type { AuthVariables } from '@/middlewares/auth-middleware.js';
import { apiError } from '@/modules/error-handler/index.js';

export type IsSelfMiddlewareContext = {
    Variables: AuthVariables;
};

export const isSelfMiddleware = () => {
    return createMiddleware<IsSelfMiddlewareContext>(async (c, next) => {
        const user = c.get('user');

        if (user.isAdmin) {
            return next();
        }

        const id = c.req.param('id');

        if (user.id !== id) {
            throw new apiError.permissionDenied();
        }

        return next();
    });
};
