type LogMetadata = Record<string, unknown>;

export interface LoggerInstance {
    child: (metadata: LogMetadata) => LoggerInstance;
    debug: (message: string, metadata?: LogMetadata) => void;
    error: (message: string, metadata?: LogMetadata) => void;
    fatal: (message: string, metadata?: LogMetadata) => void;
    info: (message: string, metadata?: LogMetadata) => void;
    trace: (message: string, metadata?: LogMetadata) => void;
    warn: (message: string, metadata?: LogMetadata) => void;
}

export type LogLevel = 'info' | 'error' | 'debug' | 'warn';

export interface CreateLoggerInstanceOptions {
    logLevel: LogLevel;
    transports: {
        console?: boolean;
        file?: boolean;
    };
}

export type CreateLoggerInstance = (options: CreateLoggerInstanceOptions) => LoggerInstance;

export interface InitLoggerOptions {
    fn: CreateLoggerInstance;
    logLevel: LogLevel;
}
