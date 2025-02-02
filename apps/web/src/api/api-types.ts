import type {
    GetApiLibraries200DataItem,
    GetApiLibraryIdAlbumArtists200DataItem,
    GetApiLibraryIdAlbums200DataItem,
    GetApiLibraryIdGenres200DataItem,
    GetApiLibraryIdPlaylists200DataItem,
    GetApiLibraryIdPlaylistsIdTracks200DataItem,
    GetApiLibraryIdTracks200DataItem,
    GetApiUsers200DataItem,
    GetPing200,
    PostAuthSignIn200Data,
} from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';

export interface Ping extends GetPing200 {}

export interface Library extends GetApiLibraries200DataItem {}

export interface AuthUser extends PostAuthSignIn200Data {}

export interface User extends GetApiUsers200DataItem {}

export interface AlbumItem extends GetApiLibraryIdAlbums200DataItem {}

export interface AlbumArtistItem extends GetApiLibraryIdAlbumArtists200DataItem {}

export interface ArtistItem extends GetApiLibraryIdAlbumArtists200DataItem {}

export interface GenreItem extends GetApiLibraryIdGenres200DataItem {}

export interface PlaylistItem extends GetApiLibraryIdPlaylists200DataItem {}

export interface PlaylistTrackItem extends GetApiLibraryIdPlaylistsIdTracks200DataItem {}

export interface TrackItem extends GetApiLibraryIdTracks200DataItem {}

export interface PlayQueueItem extends TrackItem {
    _uniqueId: string;
}
