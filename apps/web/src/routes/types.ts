import { generatePath } from 'react-router';

export const AppRoute = {
    APP: '/app/:libraryId',
    APP_ALBUM_ARTISTS: '/app/:libraryId/album-artists',
    APP_ALBUM_ARTISTS_DETAIL: '/app/:libraryId/album-artists/:albumArtistId',
    APP_ALBUM_DETAIL: '/app/:libraryId/albums/:albumId',
    APP_ALBUMS: '/app/:libraryId/albums',
    APP_ALBUMS_DETAIL: '/app/:libraryId/albums/:albumId',
    APP_ARTISTS: '/app/:libraryId/artists',
    APP_ARTISTS_DETAIL: '/app/:libraryId/artists/:artistId',
    APP_GENRES: '/app/:libraryId/genres',
    APP_HOME: '/app/:libraryId/home',
    APP_PLAYLISTS: '/app/:libraryId/playlists',
    APP_PLAYLISTS_DETAIL: '/app/:libraryId/playlists/:playlistId',
    APP_QUEUE: '/app/:libraryId/queue',
    APP_TRACKS: '/app/:libraryId/tracks',
    APP_TRACKS_DETAIL: '/app/:libraryId/tracks/:trackId',
    INDEX: '/',
    SIGN_IN: '/sign-in',

};

export function appRoute(route: keyof typeof AppRoute | string, pathParams?: Record<string, string>) {
    return generatePath(AppRoute[route as keyof typeof AppRoute], pathParams);
}
