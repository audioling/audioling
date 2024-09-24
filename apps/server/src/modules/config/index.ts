import Configstore from 'configstore';
import { type AppConfig, appConfigSchema } from '@/modules/config/config-schema.js';

export function initConfig(options: { name: string; path: string }) {
    const defaultConfig = appConfigSchema.parse({});

    const config = new Configstore(options.name, defaultConfig, {
        configPath: options.path,
    });

    return {
        all: () => config.all as AppConfig,
        clear: () => config.clear(),
        delete: (key: keyof AppConfig | string) => config.delete(key),
        get: <T extends keyof AppConfig>(key: T): AppConfig[T] => {
            return config.get(key) as AppConfig[T];
        },
        has: (key: keyof AppConfig | string) => config.has(key),
        set: <T extends keyof AppConfig>(key: T, value: AppConfig[T]) => {
            return config.set(key, value);
        },
        setAll: (value: AppConfig) => config.set(value),
    };
}

export type ConfigModule = ReturnType<typeof initConfig>;
