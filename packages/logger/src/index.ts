import { type InitLoggerOptions, type LoggerInstance } from './types.js';

export * from './types.js';
export * from './winston-adapter.js';

export const initLogger = (options: InitLoggerOptions): LoggerInstance => {
    return options.fn({
        logLevel: options.logLevel,
        transports: { console: true, file: true },
    });
};
