import type { AppDatabase } from '@/database/init-database.js';
import type { ConfigModule } from '@/modules/config/index.js';
import type { IdFactoryModule } from '@/modules/id/index.js';
import { initAuthService } from '@/services/auth/auth-service';
import { initLibraryService } from '@/services/library/library-service.js';
import { initUserService } from '@/services/user/user-service';

export const initServices = (modules: {
    config: ConfigModule;
    db: AppDatabase;
    idFactory: IdFactoryModule;
}) => {
    const { config, db, idFactory } = modules;

    const authService = initAuthService({ config, db, idFactory });
    const userService = initUserService({ db, idFactory });
    const libraryService = initLibraryService({ db, idFactory });

    const service = {
        auth: authService,
        library: libraryService,
        user: userService,
    };

    return service;
};

export type AppService = ReturnType<typeof initServices>;
