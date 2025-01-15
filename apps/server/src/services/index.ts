import type { AppDatabase } from '@/database/init-database.js';
import type { ConfigModule } from '@/modules/config/index.js';
import type { IdFactoryModule } from '@/modules/id/index.js';
import type { ImageModule } from '@/modules/image/index.js';
import type { QueryModule } from '@/modules/query/index.js';
import { initAlbumService } from '@/services/album/album-service.js';
import { initAlbumArtistService } from '@/services/album-artist/album-artist-service.js';
import { initAuthService } from '@/services/auth/auth-service';
import { initGenreService } from '@/services/genre/genre-service.js';
import { initImageService } from '@/services/image/image-service.js';
import { initLibraryService } from '@/services/library/library-service.js';
import { initPlaylistService } from '@/services/playlist/playlist-service.js';
import { initTrackService } from '@/services/track/track-service.js';
import { initUserService } from '@/services/user/user-service';

export const initServices = (modules: {
    config: ConfigModule;
    db: AppDatabase;
    idFactory: IdFactoryModule;
    imageModule: ImageModule;
    queryModule: QueryModule;
}) => {
    const { config, db, idFactory, imageModule, queryModule } = modules;

    const authService = initAuthService({ config, db, idFactory });
    const userService = initUserService({ db, idFactory });
    const libraryService = initLibraryService({ db, idFactory });
    const albumService = initAlbumService({ db });
    const trackService = initTrackService({ db, queryModule });
    const albumArtistService = initAlbumArtistService({ db });
    const genreService = initGenreService();
    const imageService = initImageService({ db, imageModule });
    const playlistService = initPlaylistService({ db, idFactory });

    const service = {
        album: albumService,
        albumArtist: albumArtistService,
        auth: authService,
        genre: genreService,
        image: imageService,
        library: libraryService,
        playlist: playlistService,
        track: trackService,
        user: userService,
    };

    return service;
};

export type AppService = ReturnType<typeof initServices>;
