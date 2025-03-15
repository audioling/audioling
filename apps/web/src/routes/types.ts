import { generatePath } from 'react-router';

export const AppRoute = {
    APP: '/app/:serverId',
    APP_ALBUM_ARTISTS: '/app/:serverId/album-artists',
    APP_ALBUM_ARTISTS_DETAIL: '/app/:serverId/album-artists/:albumArtistId',
    APP_ALBUM_DETAIL: '/app/:serverId/albums/:albumId',
    APP_ALBUMS: '/app/:serverId/albums',
    APP_ALBUMS_DETAIL: '/app/:serverId/albums/:albumId',
    APP_ARTISTS: '/app/:serverId/artists',
    APP_ARTISTS_DETAIL: '/app/:serverId/artists/:artistId',
    APP_FOLDERS: '/app/:serverId/folders',
    APP_GENRES: '/app/:serverId/genres',
    APP_HOME: '/app/:serverId/home',
    APP_PLAYLISTS: '/app/:serverId/playlists',
    APP_PLAYLISTS_DETAIL: '/app/:serverId/playlists/:playlistId',
    APP_QUEUE: '/app/:serverId/queue',
    APP_TRACKS: '/app/:serverId/tracks',
    APP_TRACKS_DETAIL: '/app/:serverId/tracks/:trackId',
    INDEX: '/',
    SIGN_IN: '/sign-in',

};

export function appRoute(route: keyof typeof AppRoute | string, pathParams?: Record<string, string>) {
    return generatePath(AppRoute[route as keyof typeof AppRoute], pathParams);
}
