import { albumApiSchema } from '@/controllers/album/album-api-schema.js';
import { albumArtistApiSchema } from '@/controllers/album-artist/album-artist-api-schema.js';
import { genreApiSchema } from '@/controllers/genre/genre-api-schema.js';
import { imageApiSchema } from '@/controllers/image/image-api-schema.js';
import { playlistApiSchema } from '@/controllers/playlist/playlist-api-schema.js';
import { trackApiSchema } from '@/controllers/track/track-api-schema.js';
import { authApiSchema } from './auth/auth-api-schema.js';
import { libraryApiSchema } from './library/library-api-schema.js';
import { rootApiSchema } from './root/root-api-schema.js';
import { userApiSchema } from './user/user-api-schema.js';

export const apiSchema = {
    album: albumApiSchema,
    albumArtist: albumArtistApiSchema,
    auth: authApiSchema,
    genre: genreApiSchema,
    image: imageApiSchema,
    library: libraryApiSchema,
    playlist: playlistApiSchema,
    root: rootApiSchema,
    track: trackApiSchema,
    user: userApiSchema,
};

export type ApiSchema = typeof apiSchema;
