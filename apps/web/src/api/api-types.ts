import type {
    GetApiLibraries200DataItem,
    GetApiLibraryIdAlbumArtists200DataItem,
    GetApiLibraryIdAlbums200DataItem,
    GetApiLibraryIdGenres200DataItem,
    GetApiLibraryIdTracks200DataItem,
    GetApiUsers200DataItem,
    GetPing200,
    PostAuthSignIn200Data,
} from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';

export interface Ping extends GetPing200 {}

export interface Library extends GetApiLibraries200DataItem {}

export interface AuthUser extends PostAuthSignIn200Data {}

export interface User extends GetApiUsers200DataItem {}

export interface Album extends GetApiLibraryIdAlbums200DataItem {}

export interface AlbumArtist extends GetApiLibraryIdAlbumArtists200DataItem {}

export interface Artist extends GetApiLibraryIdAlbumArtists200DataItem {}

export interface Genre extends GetApiLibraryIdGenres200DataItem {}

export interface Track extends GetApiLibraryIdTracks200DataItem {}
