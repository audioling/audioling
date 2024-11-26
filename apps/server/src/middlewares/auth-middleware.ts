import { createMiddleware } from 'hono/factory';
import { decode, verify } from 'hono/jwt';
import type { AppDatabase } from '@/database/init-database.js';
import { type DbUser } from '@/database/user-database.js';
import { apiError } from '@/modules/error-handler/index.js';
import type { JWTPayload } from '@/services/auth/auth-service.js';

export type AuthVariables = {
    authToken: string;
    user: DbUser;
};

type AuthMiddlewareContext = {
    Variables: AuthVariables;
};

export const authMiddleware = (tokenSecret: string, modules: { db: AppDatabase }) => {
    const { db } = modules;

    return createMiddleware<AuthMiddlewareContext>(async (c, next) => {
        const token = c.req.header('Authorization')?.replace('Bearer ', '');

        if (token) {
            const decodedPayload = decode(token);

            if (decodedPayload) {
                const payload = decodedPayload.payload as JWTPayload;
                const [err, authUser] = db.user.findByIdOrThrow(payload.userId);

                if (err) {
                    throw new apiError.internalServer({ message: 'Failed to validate user' });
                }

                c.set('user', authUser);
                c.set('authToken', token);
            }
        }

        const isProtectedPath = c.req.path.includes('/api/');

        if (isProtectedPath) {
            if (c.req.path.includes('/stream') || c.req.path.includes('/images/')) {
                const queryToken = c.req.query('token');

                if (!queryToken) {
                    throw new apiError.unauthorized({ message: 'No token provided' });
                }

                const decodedPayload = decode(queryToken) as unknown as {
                    payload: JWTPayload;
                };

                if (!decodedPayload) {
                    throw new apiError.unauthorized({ message: 'Invalid token' });
                }

                const [, isValid] = db.user.token.validate(
                    decodedPayload.payload.userId,
                    queryToken,
                );

                if (!isValid) {
                    throw new apiError.unauthorized({ message: 'Invalid token' });
                }

                return next();
            }

            if (!token) {
                throw new apiError.unauthorized({ message: 'No token provided' });
            }

            const verifiedPayload = (await verify(token, tokenSecret)) as JWTPayload;

            if (!verifiedPayload?.userId) {
                throw new apiError.unauthorized({ message: 'Invalid token' });
            }

            const [err, authUser] = db.user.findByIdOrThrow(verifiedPayload?.userId);

            if (err) {
                throw new apiError.internalServer({ message: 'Failed to validate user' });
            }

            const userToken = authUser.tokens[verifiedPayload.id];

            if (!userToken) {
                throw new apiError.unauthorized({ message: 'Invalid token' });
            }
        }

        await next();
    });
};
