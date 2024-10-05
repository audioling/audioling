import type {
    GetApiLibraries200DataItem,
    GetApiLibraryIdAlbumArtists200DataItem,
    GetApiLibraryIdAlbums200DataItem,
    GetApiLibraryIdGenres200DataItem,
    GetApiUsers200DataItem,
    GetPing200,
    PostAuthSignIn200Data,
} from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';

export type Ping = GetPing200;

export type Library = GetApiLibraries200DataItem;

export type AuthUser = PostAuthSignIn200Data;

export type User = GetApiUsers200DataItem;

export type Album = GetApiLibraryIdAlbums200DataItem;

export type AlbumArtist = GetApiLibraryIdAlbumArtists200DataItem;

export type Artist = GetApiLibraryIdAlbumArtists200DataItem;

export type Genre = GetApiLibraryIdGenres200DataItem;
