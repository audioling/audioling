import path from 'path';
import type { LogLevel } from '@repo/logger';
import { createWinstonLogger, initLogger } from '@repo/logger';
import { initApplication } from '@/application';
import { CONSTANTS } from '@/constants.js';
import { initDatabase } from '@/database/init-database.js';
import { initConfig } from '@/modules/config/index.js';
import { initIdFactoryModule } from '@/modules/id/index.js';
import { initImageModule } from '@/modules/image/index.js';

const config = initConfig({
    name: CONSTANTS.APP_NAME,
    path: path.join(CONSTANTS.APP_DIR, `config-server.json`),
});

export const appLogger = initLogger({
    fn: createWinstonLogger,
    logLevel: (process.env.APP_LOG_LEVEL || config.get('logLevel') || 'info') as LogLevel,
});

const idFactory = initIdFactoryModule();
const imageModule = initImageModule();

const db = initDatabase({ idFactory });

await initApplication({
    config,
    modules: {
        db,
        idFactory,
        imageModule,
    },
});
