import path from 'path';
import Configstore from 'configstore';
import { CONSTANTS } from '@/constants.js';

export const initJsonDatabase = <TSchema extends Record<string, unknown>>(options: {
    default: TSchema;
    name: string;
}) => {
    const config = new Configstore(options.name, options.default, {
        configPath: path.join(CONSTANTS.APP_DIR, `db-${options.name}.json`),
    });

    return {
        all: () => config.all as TSchema,
        clear: () => config.clear(),
        delete: (key: keyof TSchema | string) => config.delete(key as string),
        get: (key: keyof TSchema | string) => config.get(key as string) as TSchema[keyof TSchema],
        has: (key: keyof TSchema | string) => config.has(key as string),
        set: (
            key: keyof TSchema | string,
            value: TSchema[keyof TSchema] | Record<string, unknown>,
        ) => config.set(key as string, value),
        setAll: (value: TSchema) => config.set(value),
    };
};

export type JsonAppDatabase = ReturnType<typeof initJsonDatabase>;
