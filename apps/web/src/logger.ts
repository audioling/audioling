import dayjs from 'dayjs';

export interface LogFn {
    (message?: any, ...optionalParams: any[]): void;
}

export interface Logger {
    debug: LogFn;
    error: LogFn;
    info: LogFn;
    warn: LogFn;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVEL: LogLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const NO_OP: LogFn = (_message?: any, ..._optionalParams: any[]) => {};

export class ConsoleLogger implements Logger {
    readonly debug: LogFn;
    readonly info: LogFn;
    readonly warn: LogFn;
    readonly error: LogFn;

    constructor(options?: { level?: LogLevel }) {
        const { level } = options || {};

        // Create timestamp wrapper function with colors
        const withTimestamp = (logLevel: string, color: string): LogFn => {
            return (message?: any, ...meta: any) => {
                const timestamp = dayjs().format('HH:mm:ss');
                const paddedLevel = logLevel.toUpperCase().padEnd(5, ' ');
                console.log(
                    `[${timestamp}] ${color}[${paddedLevel}]\x1B[0m ${message}`,
                    JSON.stringify(meta),
                );
            };
        };

        const colors = {
            debug: '\x1B[38;2;54;96;146m', // #366092
            error: '\x1B[38;2;240;0;0m', // #f00000
            info: '\x1B[38;2;0;125;60m', // #007d3c
            warn: '\x1B[38;2;225;125;50m', // #e17d32
        };

        this.error = withTimestamp('error', colors.error);

        if (level === 'error') {
            this.warn = NO_OP;
            this.info = NO_OP;
            this.debug = NO_OP;
            return;
        }

        this.warn = withTimestamp('warn', colors.warn);

        if (level === 'warn') {
            this.info = NO_OP;
            this.debug = NO_OP;
            return;
        }

        this.info = withTimestamp('info', colors.info);

        if (level === 'info') {
            this.debug = NO_OP;
            return;
        }

        this.debug = withTimestamp('debug', colors.debug);
    }
}

export const logger = new ConsoleLogger({ level: LOG_LEVEL });
