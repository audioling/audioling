import bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt';
import type { AppDatabase } from '@/database/init-database';
import { writeLog } from '@/middlewares/logger-middleware.js';
import type { ConfigModule } from '@/modules/config/index.js';
import { apiError } from '@/modules/error-handler';
import type { IdFactoryModule } from '@/modules/id/index.js';

export type JWTPayload = {
    exp?: number;
    iat?: number;
    id: string;
    nbf?: number;
    userId: string;
};

// SECTION - Auth Service
export const initAuthService = (modules: {
    config: ConfigModule;
    db: AppDatabase;
    idFactory: IdFactoryModule;
}) => {
    const { config, db, idFactory } = modules;

    return {
        // ANCHOR - Generate refresh token
        generateRefreshToken: async (id: string, expiration?: number) => {
            const expectedExpiration = Number(expiration);
            const parsedExpirationMinutes = isNaN(expectedExpiration) ? 7200 : expectedExpiration;
            const currentTimeSeconds = Date.now() / 1000;

            const payload = {
                exp: Math.floor(Date.now() / 1000) + 60 * parsedExpirationMinutes,
                iat: currentTimeSeconds,
                id,
                nbf: currentTimeSeconds,
            };

            const secret = config.get('tokenSecret');
            const token = await sign(payload, secret);

            return token;
        },
        // ANCHOR - Generate token
        generateToken: async (userId: string, expiration?: string) => {
            const id = idFactory.generate();
            const expectedExpiration = Number(expiration);
            const parsedExpirationMinutes = isNaN(expectedExpiration) ? 7200 : expectedExpiration;
            const currentTimeSeconds = Date.now() / 1000;

            const payload: JWTPayload = {
                exp: expiration
                    ? Math.floor(Date.now() / 1000) + 60 * parsedExpirationMinutes
                    : undefined,
                iat: expiration ? currentTimeSeconds : undefined,
                id,
                nbf: expiration ? currentTimeSeconds : undefined,
                userId,
            };

            const secret = config.get('tokenSecret');
            const token = await sign(payload, secret);

            return { id, token };
        },
        // ANCHOR - Register
        register: async (args: { password: string; username: string }) => {
            const [err, users] = db.user.findAll({});

            if (err) {
                throw new apiError.internalServer({ message: 'Failed to find users' });
            }

            const usersCount = users.data.length;

            const isRegistrationAllowed = config.get('registrationAllowed');

            if (!isRegistrationAllowed && usersCount > 0) {
                throw new apiError.badRequest({ message: 'Registration is not allowed' });
            }

            const [isUserExistsErr, isUserExists] = db.user.findByUsername(args.username);

            if (isUserExistsErr) {
                throw new apiError.internalServer({ message: 'Failed to check if user exists' });
            }

            if (isUserExists) {
                throw new apiError.conflict({ message: 'User already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(args.password, salt);

            const [createdErr, created] = db.user.insert({
                displayName: null,
                id: idFactory.generate(),
                isAdmin: usersCount === 0,
                isEnabled: true,
                password: hashedPassword,
                tokens: [],
                username: args.username,
            });

            if (createdErr) {
                throw new apiError.internalServer({ message: 'Failed to create user' });
            }

            writeLog.info(`User ${args.username} was created`);

            return created;
        },
        // ANCHOR - Sign in
        signIn: async (args: { password: string; username: string }) => {
            const [err, authUser] = db.user.findByUsername(args.username);

            if (err) {
                throw new apiError.internalServer({ message: 'Failed to sign in' });
            }

            if (!authUser) {
                throw new apiError.notFound({ message: 'User not found' });
            }

            if (!authUser.isEnabled) {
                throw new apiError.unauthorized({ message: 'User is disabled' });
            }

            const isPasswordValid = await bcrypt.compare(args.password, authUser.password);

            if (!isPasswordValid) {
                throw new apiError.unauthorized({ message: 'Invalid credentials' });
            }

            const generatedToken = await initAuthService(modules).generateToken(authUser.id);

            db.user.updateById(authUser.id, {
                tokens: [...authUser.tokens, generatedToken],
            });

            writeLog.info(`User ${args.username} signed in`);

            return {
                token: generatedToken,
                user: authUser,
            };
        },
        // ANCHOR - Sign out
        signOut: async (userId: string, tokenId?: string) => {
            const [err, authUser] = db.user.findById(userId);

            if (err) {
                throw new apiError.internalServer({ message: 'Failed to sign out' });
            }

            if (!authUser) {
                throw new apiError.notFound({ message: 'User not found' });
            }

            if (tokenId) {
                db.user.updateById(userId, {
                    tokens: authUser.tokens.filter((token) => token.id !== tokenId),
                });

                writeLog.info(`User ${authUser.username} signed out of session ${tokenId}`);
            } else {
                db.user.updateById(userId, {
                    tokens: [],
                });

                writeLog.info(`User ${authUser.username} signed out of all sessions`);
            }
        },
    };
};

export type AuthService = ReturnType<typeof initAuthService>;
