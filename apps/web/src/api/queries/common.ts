// generated with @7nohe/openapi-react-query-codegen@1.6.1 

import { UseQueryResult } from "@tanstack/react-query";
import { AlbumArtistsService, AlbumsService, AuthenticationService, GenresService, LibrariesService, RootService, TracksService, UsersService } from "../requests/services.gen";
export type RootServiceGetPingDefaultResponse = Awaited<ReturnType<typeof RootService.getPing>>;
export type RootServiceGetPingQueryResult<TData = RootServiceGetPingDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRootServiceGetPingKey = "RootServiceGetPing";
export const UseRootServiceGetPingKeyFn = (queryKey?: Array<unknown>) => [useRootServiceGetPingKey, ...(queryKey ?? [])];
export type UsersServiceGetApiUsersDefaultResponse = Awaited<ReturnType<typeof UsersService.getApiUsers>>;
export type UsersServiceGetApiUsersQueryResult<TData = UsersServiceGetApiUsersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUsersServiceGetApiUsersKey = "UsersServiceGetApiUsers";
export const UseUsersServiceGetApiUsersKeyFn = ({ limit, offset, sortBy, sortOrder }: {
  limit?: string;
  offset?: string;
  sortBy: "createdAt" | "displayName" | "name" | "updatedAt";
  sortOrder: "asc" | "desc";
}, queryKey?: Array<unknown>) => [useUsersServiceGetApiUsersKey, ...(queryKey ?? [{ limit, offset, sortBy, sortOrder }])];
export type UsersServiceGetApiUsersByIdDefaultResponse = Awaited<ReturnType<typeof UsersService.getApiUsersById>>;
export type UsersServiceGetApiUsersByIdQueryResult<TData = UsersServiceGetApiUsersByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUsersServiceGetApiUsersByIdKey = "UsersServiceGetApiUsersById";
export const UseUsersServiceGetApiUsersByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useUsersServiceGetApiUsersByIdKey, ...(queryKey ?? [{ id }])];
export type LibrariesServiceGetApiLibrariesDefaultResponse = Awaited<ReturnType<typeof LibrariesService.getApiLibraries>>;
export type LibrariesServiceGetApiLibrariesQueryResult<TData = LibrariesServiceGetApiLibrariesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLibrariesServiceGetApiLibrariesKey = "LibrariesServiceGetApiLibraries";
export const UseLibrariesServiceGetApiLibrariesKeyFn = ({ limit, offset, sortBy, sortOrder }: {
  limit?: string;
  offset?: string;
  sortBy: "createdAt" | "name" | "updatedAt" | "type";
  sortOrder: "asc" | "desc";
}, queryKey?: Array<unknown>) => [useLibrariesServiceGetApiLibrariesKey, ...(queryKey ?? [{ limit, offset, sortBy, sortOrder }])];
export type LibrariesServiceGetApiLibrariesByIdDefaultResponse = Awaited<ReturnType<typeof LibrariesService.getApiLibrariesById>>;
export type LibrariesServiceGetApiLibrariesByIdQueryResult<TData = LibrariesServiceGetApiLibrariesByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLibrariesServiceGetApiLibrariesByIdKey = "LibrariesServiceGetApiLibrariesById";
export const UseLibrariesServiceGetApiLibrariesByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useLibrariesServiceGetApiLibrariesByIdKey, ...(queryKey ?? [{ id }])];
export type AlbumsServiceGetApiByLibraryIdAlbumsDefaultResponse = Awaited<ReturnType<typeof AlbumsService.getApiByLibraryIdAlbums>>;
export type AlbumsServiceGetApiByLibraryIdAlbumsQueryResult<TData = AlbumsServiceGetApiByLibraryIdAlbumsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAlbumsServiceGetApiByLibraryIdAlbumsKey = "AlbumsServiceGetApiByLibraryIdAlbums";
export const UseAlbumsServiceGetApiByLibraryIdAlbumsKeyFn = ({ folderId, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "communityRating" | "criticRating" | "dateAdded" | "datePlayed" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "trackCount" | "year";
  sortOrder: "asc" | "desc";
}, queryKey?: Array<unknown>) => [useAlbumsServiceGetApiByLibraryIdAlbumsKey, ...(queryKey ?? [{ folderId, limit, offset, searchTerm, sortBy, sortOrder }])];
export type AlbumsServiceGetApiByLibraryIdAlbumsByIdDefaultResponse = Awaited<ReturnType<typeof AlbumsService.getApiByLibraryIdAlbumsById>>;
export type AlbumsServiceGetApiByLibraryIdAlbumsByIdQueryResult<TData = AlbumsServiceGetApiByLibraryIdAlbumsByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAlbumsServiceGetApiByLibraryIdAlbumsByIdKey = "AlbumsServiceGetApiByLibraryIdAlbumsById";
export const UseAlbumsServiceGetApiByLibraryIdAlbumsByIdKeyFn = ({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  id: string;
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "year" | "album" | "bpm" | "channels" | "comment" | "genre" | "id" | "rating" | "recentlyAdded" | "recentlyPlayed";
  sortOrder: "asc" | "desc";
}, queryKey?: Array<unknown>) => [useAlbumsServiceGetApiByLibraryIdAlbumsByIdKey, ...(queryKey ?? [{ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }])];
export type TracksServiceGetApiByLibraryIdTracksDefaultResponse = Awaited<ReturnType<typeof TracksService.getApiByLibraryIdTracks>>;
export type TracksServiceGetApiByLibraryIdTracksQueryResult<TData = TracksServiceGetApiByLibraryIdTracksDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTracksServiceGetApiByLibraryIdTracksKey = "TracksServiceGetApiByLibraryIdTracks";
export const UseTracksServiceGetApiByLibraryIdTracksKeyFn = ({ folderId, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "year" | "album" | "bpm" | "channels" | "comment" | "genre" | "id" | "rating" | "recentlyAdded" | "recentlyPlayed";
  sortOrder: "asc" | "desc";
}, queryKey?: Array<unknown>) => [useTracksServiceGetApiByLibraryIdTracksKey, ...(queryKey ?? [{ folderId, limit, offset, searchTerm, sortBy, sortOrder }])];
export type TracksServiceGetApiByLibraryIdTracksByIdDefaultResponse = Awaited<ReturnType<typeof TracksService.getApiByLibraryIdTracksById>>;
export type TracksServiceGetApiByLibraryIdTracksByIdQueryResult<TData = TracksServiceGetApiByLibraryIdTracksByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTracksServiceGetApiByLibraryIdTracksByIdKey = "TracksServiceGetApiByLibraryIdTracksById";
export const UseTracksServiceGetApiByLibraryIdTracksByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useTracksServiceGetApiByLibraryIdTracksByIdKey, ...(queryKey ?? [{ id }])];
export type AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsDefaultResponse = Awaited<ReturnType<typeof AlbumArtistsService.getApiByLibraryIdAlbumArtists>>;
export type AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsQueryResult<TData = AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsKey = "AlbumArtistsServiceGetApiByLibraryIdAlbumArtists";
export const UseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsKeyFn = ({ folderId, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "dateAdded" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "trackCount" | "album" | "rating" | "albumCount";
  sortOrder: "asc" | "desc";
}, queryKey?: Array<unknown>) => [useAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsKey, ...(queryKey ?? [{ folderId, limit, offset, searchTerm, sortBy, sortOrder }])];
export type AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdDefaultResponse = Awaited<ReturnType<typeof AlbumArtistsService.getApiByLibraryIdAlbumArtistsById>>;
export type AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdQueryResult<TData = AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdKey = "AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsById";
export const UseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdKey, ...(queryKey ?? [{ id }])];
export type AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdAlbumsDefaultResponse = Awaited<ReturnType<typeof AlbumArtistsService.getApiByLibraryIdAlbumArtistsByIdAlbums>>;
export type AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdAlbumsQueryResult<TData = AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdAlbumsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdAlbumsKey = "AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdAlbums";
export const UseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdAlbumsKeyFn = ({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  id: string;
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "communityRating" | "criticRating" | "dateAdded" | "datePlayed" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "trackCount" | "year";
  sortOrder: "asc" | "desc";
}, queryKey?: Array<unknown>) => [useAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdAlbumsKey, ...(queryKey ?? [{ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }])];
export type AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdTracksDefaultResponse = Awaited<ReturnType<typeof AlbumArtistsService.getApiByLibraryIdAlbumArtistsByIdTracks>>;
export type AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdTracksQueryResult<TData = AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdTracksDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdTracksKey = "AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdTracks";
export const UseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdTracksKeyFn = ({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  id: string;
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "year" | "album" | "bpm" | "channels" | "comment" | "genre" | "id" | "rating" | "recentlyAdded" | "recentlyPlayed";
  sortOrder: "asc" | "desc";
}, queryKey?: Array<unknown>) => [useAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdTracksKey, ...(queryKey ?? [{ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }])];
export type GenresServiceGetApiByLibraryIdGenresDefaultResponse = Awaited<ReturnType<typeof GenresService.getApiByLibraryIdGenres>>;
export type GenresServiceGetApiByLibraryIdGenresQueryResult<TData = GenresServiceGetApiByLibraryIdGenresDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGenresServiceGetApiByLibraryIdGenresKey = "GenresServiceGetApiByLibraryIdGenres";
export const UseGenresServiceGetApiByLibraryIdGenresKeyFn = ({ folderId, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "trackCount" | "albumCount";
  sortOrder: "asc" | "desc";
}, queryKey?: Array<unknown>) => [useGenresServiceGetApiByLibraryIdGenresKey, ...(queryKey ?? [{ folderId, limit, offset, searchTerm, sortBy, sortOrder }])];
export type AuthenticationServicePostAuthSignInMutationResult = Awaited<ReturnType<typeof AuthenticationService.postAuthSignIn>>;
export type AuthenticationServicePostAuthSignOutMutationResult = Awaited<ReturnType<typeof AuthenticationService.postAuthSignOut>>;
export type AuthenticationServicePostAuthRegisterMutationResult = Awaited<ReturnType<typeof AuthenticationService.postAuthRegister>>;
export type UsersServicePostApiUsersMutationResult = Awaited<ReturnType<typeof UsersService.postApiUsers>>;
export type LibrariesServicePostApiLibrariesMutationResult = Awaited<ReturnType<typeof LibrariesService.postApiLibraries>>;
export type AlbumsServicePostApiByLibraryIdAlbumsByIdFavoriteMutationResult = Awaited<ReturnType<typeof AlbumsService.postApiByLibraryIdAlbumsByIdFavorite>>;
export type TracksServicePostApiByLibraryIdTracksByIdFavoriteMutationResult = Awaited<ReturnType<typeof TracksService.postApiByLibraryIdTracksByIdFavorite>>;
export type AlbumArtistsServicePostApiByLibraryIdAlbumArtistsByIdFavoriteMutationResult = Awaited<ReturnType<typeof AlbumArtistsService.postApiByLibraryIdAlbumArtistsByIdFavorite>>;
export type UsersServicePutApiUsersByIdMutationResult = Awaited<ReturnType<typeof UsersService.putApiUsersById>>;
export type LibrariesServicePutApiLibrariesByIdMutationResult = Awaited<ReturnType<typeof LibrariesService.putApiLibrariesById>>;
export type UsersServiceDeleteApiUsersByIdMutationResult = Awaited<ReturnType<typeof UsersService.deleteApiUsersById>>;
export type LibrariesServiceDeleteApiLibrariesByIdMutationResult = Awaited<ReturnType<typeof LibrariesService.deleteApiLibrariesById>>;
export type AlbumsServiceDeleteApiByLibraryIdAlbumsByIdFavoriteMutationResult = Awaited<ReturnType<typeof AlbumsService.deleteApiByLibraryIdAlbumsByIdFavorite>>;
export type TracksServiceDeleteApiByLibraryIdTracksByIdFavoriteMutationResult = Awaited<ReturnType<typeof TracksService.deleteApiByLibraryIdTracksByIdFavorite>>;
export type AlbumArtistsServiceDeleteApiByLibraryIdAlbumArtistsByIdFavoriteMutationResult = Awaited<ReturnType<typeof AlbumArtistsService.deleteApiByLibraryIdAlbumArtistsByIdFavorite>>;
