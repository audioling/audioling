import { createLogger, format, transports } from 'winston';
import { type CreateLoggerInstanceOptions, type LoggerInstance } from './types.js';

const { combine, timestamp, printf } = format;

// const errorFilter = format((info) => {
//     return info.level === 'error' ? info : false;
// });

// const infoFilter = format((info) => {
//     return info.level === 'info' ? info : false;
// });

const logFormat = printf((props) => {
    return `${props.timestamp} [${props.level.toUpperCase().padEnd(5)}]: ${props.message}`;
});

export const createWinstonLogger = (options: CreateLoggerInstanceOptions) => {
    const logInstance = createLogger({
        format: combine(timestamp({ format: 'HH.mm.ss' }), logFormat),
        level: options.logLevel,
        levels: {
            debug: 5,
            error: 1,
            fatal: 0,
            info: 3,
            trace: 4,
            warn: 2,
        },
        transports: [
            new transports.Console(),
            // new transports.File({
            //     filename: 'combined.log',
            // }),
            // new transports.File({
            //     filename: 'app-error.log',
            //     format: combine(errorFilter(), timestamp(), json()),
            //     level: 'error',
            // }),
            // new transports.File({
            //     filename: 'app-info.log',
            //     format: combine(infoFilter(), timestamp(), json()),
            //     level: 'info',
            // }),
        ],
    });

    const logger: LoggerInstance = {
        child: () => createWinstonLogger(options),
        debug: logInstance.debug.bind(logInstance),
        error: logInstance.error.bind(logInstance),
        fatal: logInstance.error.bind(logInstance),
        info: logInstance.info.bind(logInstance),
        trace: logInstance.info.bind(logInstance),
        warn: logInstance.warn.bind(logInstance),
    };

    return logger;
};
