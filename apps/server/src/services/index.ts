import type { AppDatabase } from '@/database/init-database.js';
import type { ConfigModule } from '@/modules/config/index.js';
import type { IdFactoryModule } from '@/modules/id/index.js';
import { initAlbumService } from '@/services/album/album-service.js';
import { initAlbumArtistService } from '@/services/album-artist/album-artist-service.js';
import { initAuthService } from '@/services/auth/auth-service';
import { initGenreService } from '@/services/genre/genre-service.js';
import { initLibraryService } from '@/services/library/library-service.js';
import { initTrackService } from '@/services/track/track-service.js';
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
    const albumService = initAlbumService();
    const trackService = initTrackService();
    const albumArtistService = initAlbumArtistService();
    const genreService = initGenreService();

    const service = {
        album: albumService,
        albumArtist: albumArtistService,
        auth: authService,
        genre: genreService,
        library: libraryService,
        track: trackService,
        user: userService,
    };

    return service;
};

export type AppService = ReturnType<typeof initServices>;
