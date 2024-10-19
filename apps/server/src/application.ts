import path from 'path';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { CONSTANTS } from '@/constants.js';
import { initAlbumController } from '@/controllers/album/album-controller.js';
import { initAlbumArtistController } from '@/controllers/album-artist/album-artist-controller.js';
import { initAuthController } from '@/controllers/auth/auth-controller.js';
import { initGenreController } from '@/controllers/genre/genre-controller.js';
import { initImageController } from '@/controllers/image/image-controller.js';
import { initLibraryController } from '@/controllers/library/library-controller.js';
import { initPlaylistController } from '@/controllers/playlist/playlist-controller.js';
import { initRootController } from '@/controllers/root/root-controller';
import { initTrackController } from '@/controllers/track/track-controller.js';
import { initUserController } from '@/controllers/user/user-controller.js';
import type { AppDatabase } from '@/database/init-database.js';
import { adapterMiddleware } from '@/middlewares/adapter-middleware.js';
import { authMiddleware } from '@/middlewares/auth-middleware.js';
import { loggerMiddleware, writeLog } from '@/middlewares/logger-middleware.js';
import type { ConfigModule } from '@/modules/config/index.js';
import { initConfig } from '@/modules/config/index.js';
import { apiError } from '@/modules/error-handler/index.js';
import type { IdFactoryModule } from '@/modules/id/index.js';
import type { ImageModule } from '@/modules/image/index.js';
import { initOpenApiUI } from '@/modules/open-api';
import { initServices } from '@/services/index.js';

type ApplicationOptions = {
    config: ConfigModule;
    modules: {
        db: AppDatabase;
        idFactory: IdFactoryModule;
        imageModule: ImageModule;
    };
};

export const initApplication = async (options: ApplicationOptions) => {
    const { modules } = options;
    const { db, idFactory, imageModule } = modules;

    const config = initConfig({
        name: CONSTANTS.APP_NAME,
        path: path.join(CONSTANTS.APP_DIR, `config-server.json`),
    });

    const app = new OpenAPIHono();

    app.use(
        '/*',
        cors({
            allowHeaders: ['X-Requested-With', 'Content-Type', 'Authorization'],
            allowMethods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE', 'HEAD'],
            credentials: true,
            maxAge: 86400,
            origin: '*',
        }),
    );

    app.use('/*', authMiddleware(config.get('tokenSecret'), { db }));

    app.use(loggerMiddleware());

    const server = Bun.serve({
        fetch: app.fetch,
        port: config.get('port') || 4544,
    });

    const service = initServices({ config, db, idFactory, imageModule });

    const rootController = initRootController({ service });
    const authController = initAuthController({ service });
    const userController = initUserController({ service });
    const libraryController = initLibraryController({ service });
    const albumController = initAlbumController({ service });
    const trackController = initTrackController({ service });
    const albumArtistController = initAlbumArtistController({ service });
    const genreController = initGenreController({ service });
    const imageController = initImageController({ service });
    const playlistController = initPlaylistController({ service });

    app.route('/', rootController);
    app.route('/auth', authController);
    app.route('/api/users', userController);
    app.route('/api/libraries', libraryController);
    app.use('/api/:libraryId/*', adapterMiddleware(db, service.library));
    app.route('/api/:libraryId/albums', albumController);
    app.route('/api/:libraryId/tracks', trackController);
    app.route('/api/:libraryId/album-artists', albumArtistController);
    app.route('/api/:libraryId/genres', genreController);
    app.route('/api/:libraryId/images', imageController);
    app.route('/api/:libraryId/playlists', playlistController);

    app.onError((err, c) => {
        writeLog.error(err.message, {
            cause: err.cause,
            stack: err.stack,
        });

        if (err instanceof HTTPException) {
            // Handle default HTTPException thrown from Hono JWT middleware
            if (err.message === 'Unauthorized' || err.status === 401) {
                const unauthError = new apiError.unauthorized({ message: 'Unauthorized' });

                return c.json(
                    {
                        cause: err.cause,
                        message: unauthError.message,
                        name: unauthError.name,
                        stack: unauthError.stack,
                        status: unauthError.status,
                    },
                    unauthError.status,
                );
            }

            return c.json(
                {
                    cause: err.cause,
                    message: err.message,
                    name: err.name,
                    stack: err.stack,
                    status: err.status,
                },
                err.status,
            );
        }

        return c.json(
            {
                cause: err.cause,
                message: err.message,
                name: err.name,
                stack: err.stack,
                status: 500,
            },
            500,
        );
    });

    if (config.get('openApi') || CONSTANTS.NODE_ENV === CONSTANTS.ENV.DEVELOPMENT) {
        initOpenApiUI(app);
    }

    return server;
};
