import { createMiddleware } from 'hono/factory';
import { logger as honoLoggerMiddleware } from 'hono/logger';
import { appLogger } from '@/index.js';
import type { AuthVariables } from '@/middlewares/auth-middleware.js';

export const writeLog = {
    debug: (message: string, metadata?: { [key: string]: unknown }) => {
        appLogger.debug(message, metadata);
    },
    error: (message: string, metadata?: { [key: string]: unknown }) => {
        appLogger.error(message, metadata);
    },
    fatal: (message: string, metadata?: { [key: string]: unknown }) => {
        appLogger.fatal(message, metadata);
    },
    info: (message: string, metadata?: { [key: string]: unknown }) => {
        appLogger.info(message, metadata);
    },
    trace: (message: string, metadata?: { [key: string]: unknown }) => {
        appLogger.trace(message, metadata);
    },
    warn: (message: string, metadata?: { [key: string]: unknown }) => {
        appLogger.warn(message, metadata);
    },
};

const customLogger = (user?: AuthVariables['user']) => {
    return (message: string) => {
        appLogger.debug(
            `${message.padEnd(20)} — ${user ? `${user.username + '@' + user.id}` : '—'}`,
        );
    };
};

type LoggerMiddlewareContext = {
    Variables: Partial<AuthVariables>;
};

export const loggerMiddleware = () => {
    return createMiddleware<LoggerMiddlewareContext>(async (c, next) => {
        await honoLoggerMiddleware(customLogger(c.get('user')))(c, next);
    });
};
