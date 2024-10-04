// generated with @7nohe/openapi-react-query-codegen@1.6.1 

import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { AlbumArtistsService, AlbumsService, AuthenticationService, GenresService, LibrariesService, RootService, TracksService, UsersService } from "../requests/services.gen";
import * as Common from "./common";
export const useRootServiceGetPing = <TData = Common.RootServiceGetPingDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRootServiceGetPingKeyFn(queryKey), queryFn: () => RootService.getPing() as TData, ...options });
export const useUsersServiceGetApiUsers = <TData = Common.UsersServiceGetApiUsersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, sortBy, sortOrder }: {
  limit?: string;
  offset?: string;
  sortBy: "createdAt" | "displayName" | "name" | "updatedAt";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetApiUsersKeyFn({ limit, offset, sortBy, sortOrder }, queryKey), queryFn: () => UsersService.getApiUsers({ limit, offset, sortBy, sortOrder }) as TData, ...options });
export const useUsersServiceGetApiUsersById = <TData = Common.UsersServiceGetApiUsersByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetApiUsersByIdKeyFn({ id }, queryKey), queryFn: () => UsersService.getApiUsersById({ id }) as TData, ...options });
export const useLibrariesServiceGetApiLibraries = <TData = Common.LibrariesServiceGetApiLibrariesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, sortBy, sortOrder }: {
  limit?: string;
  offset?: string;
  sortBy: "createdAt" | "name" | "updatedAt" | "type";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLibrariesServiceGetApiLibrariesKeyFn({ limit, offset, sortBy, sortOrder }, queryKey), queryFn: () => LibrariesService.getApiLibraries({ limit, offset, sortBy, sortOrder }) as TData, ...options });
export const useLibrariesServiceGetApiLibrariesById = <TData = Common.LibrariesServiceGetApiLibrariesByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLibrariesServiceGetApiLibrariesByIdKeyFn({ id }, queryKey), queryFn: () => LibrariesService.getApiLibrariesById({ id }) as TData, ...options });
export const useAlbumsServiceGetApiByLibraryIdAlbums = <TData = Common.AlbumsServiceGetApiByLibraryIdAlbumsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ folderId, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "communityRating" | "criticRating" | "dateAdded" | "datePlayed" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "trackCount" | "year";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAlbumsServiceGetApiByLibraryIdAlbumsKeyFn({ folderId, limit, offset, searchTerm, sortBy, sortOrder }, queryKey), queryFn: () => AlbumsService.getApiByLibraryIdAlbums({ folderId, limit, offset, searchTerm, sortBy, sortOrder }) as TData, ...options });
export const useAlbumsServiceGetApiByLibraryIdAlbumsById = <TData = Common.AlbumsServiceGetApiByLibraryIdAlbumsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  id: string;
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "year" | "album" | "bpm" | "channels" | "comment" | "genre" | "id" | "rating" | "recentlyAdded" | "recentlyPlayed";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAlbumsServiceGetApiByLibraryIdAlbumsByIdKeyFn({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }, queryKey), queryFn: () => AlbumsService.getApiByLibraryIdAlbumsById({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }) as TData, ...options });
export const useTracksServiceGetApiByLibraryIdTracks = <TData = Common.TracksServiceGetApiByLibraryIdTracksDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ folderId, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "year" | "album" | "bpm" | "channels" | "comment" | "genre" | "id" | "rating" | "recentlyAdded" | "recentlyPlayed";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTracksServiceGetApiByLibraryIdTracksKeyFn({ folderId, limit, offset, searchTerm, sortBy, sortOrder }, queryKey), queryFn: () => TracksService.getApiByLibraryIdTracks({ folderId, limit, offset, searchTerm, sortBy, sortOrder }) as TData, ...options });
export const useTracksServiceGetApiByLibraryIdTracksById = <TData = Common.TracksServiceGetApiByLibraryIdTracksByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTracksServiceGetApiByLibraryIdTracksByIdKeyFn({ id }, queryKey), queryFn: () => TracksService.getApiByLibraryIdTracksById({ id }) as TData, ...options });
export const useAlbumArtistsServiceGetApiByLibraryIdAlbumArtists = <TData = Common.AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ folderId, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "dateAdded" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "trackCount" | "album" | "rating" | "albumCount";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsKeyFn({ folderId, limit, offset, searchTerm, sortBy, sortOrder }, queryKey), queryFn: () => AlbumArtistsService.getApiByLibraryIdAlbumArtists({ folderId, limit, offset, searchTerm, sortBy, sortOrder }) as TData, ...options });
export const useAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsById = <TData = Common.AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdKeyFn({ id }, queryKey), queryFn: () => AlbumArtistsService.getApiByLibraryIdAlbumArtistsById({ id }) as TData, ...options });
export const useAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdAlbums = <TData = Common.AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdAlbumsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  id: string;
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "communityRating" | "criticRating" | "dateAdded" | "datePlayed" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "trackCount" | "year";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdAlbumsKeyFn({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }, queryKey), queryFn: () => AlbumArtistsService.getApiByLibraryIdAlbumArtistsByIdAlbums({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }) as TData, ...options });
export const useAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdTracks = <TData = Common.AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdTracksDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  id: string;
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "year" | "album" | "bpm" | "channels" | "comment" | "genre" | "id" | "rating" | "recentlyAdded" | "recentlyPlayed";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdTracksKeyFn({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }, queryKey), queryFn: () => AlbumArtistsService.getApiByLibraryIdAlbumArtistsByIdTracks({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }) as TData, ...options });
export const useGenresServiceGetApiByLibraryIdGenres = <TData = Common.GenresServiceGetApiByLibraryIdGenresDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ folderId, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "trackCount" | "albumCount";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGenresServiceGetApiByLibraryIdGenresKeyFn({ folderId, limit, offset, searchTerm, sortBy, sortOrder }, queryKey), queryFn: () => GenresService.getApiByLibraryIdGenres({ folderId, limit, offset, searchTerm, sortBy, sortOrder }) as TData, ...options });
export const useAuthenticationServicePostAuthSignIn = <TData = Common.AuthenticationServicePostAuthSignInMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: { password: string; username: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: { password: string; username: string; };
}, TContext>({ mutationFn: ({ requestBody }) => AuthenticationService.postAuthSignIn({ requestBody }) as unknown as Promise<TData>, ...options });
export const useAuthenticationServicePostAuthSignOut = <TData = Common.AuthenticationServicePostAuthSignOutMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: { token?: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: { token?: string; };
}, TContext>({ mutationFn: ({ requestBody }) => AuthenticationService.postAuthSignOut({ requestBody }) as unknown as Promise<TData>, ...options });
export const useAuthenticationServicePostAuthRegister = <TData = Common.AuthenticationServicePostAuthRegisterMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: { password: string; username: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: { password: string; username: string; };
}, TContext>({ mutationFn: ({ requestBody }) => AuthenticationService.postAuthRegister({ requestBody }) as unknown as Promise<TData>, ...options });
export const useUsersServicePostApiUsers = <TData = Common.UsersServicePostApiUsersMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: { displayName?: string; isAdmin?: boolean; isEnabled?: boolean; password: string; username: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: { displayName?: string; isAdmin?: boolean; isEnabled?: boolean; password: string; username: string; };
}, TContext>({ mutationFn: ({ requestBody }) => UsersService.postApiUsers({ requestBody }) as unknown as Promise<TData>, ...options });
export const useLibrariesServicePostApiLibraries = <TData = Common.LibrariesServicePostApiLibrariesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: { baseUrl: string; displayName: string; isPublic?: boolean; password: string; type: "JELLYFIN" | "NAVIDROME" | "SUBSONIC"; username: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: { baseUrl: string; displayName: string; isPublic?: boolean; password: string; type: "JELLYFIN" | "NAVIDROME" | "SUBSONIC"; username: string; };
}, TContext>({ mutationFn: ({ requestBody }) => LibrariesService.postApiLibraries({ requestBody }) as unknown as Promise<TData>, ...options });
export const useAlbumsServicePostApiByLibraryIdAlbumsByIdFavorite = <TData = Common.AlbumsServicePostApiByLibraryIdAlbumsByIdFavoriteMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => AlbumsService.postApiByLibraryIdAlbumsByIdFavorite({ id }) as unknown as Promise<TData>, ...options });
export const useTracksServicePostApiByLibraryIdTracksByIdFavorite = <TData = Common.TracksServicePostApiByLibraryIdTracksByIdFavoriteMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => TracksService.postApiByLibraryIdTracksByIdFavorite({ id }) as unknown as Promise<TData>, ...options });
export const useAlbumArtistsServicePostApiByLibraryIdAlbumArtistsByIdFavorite = <TData = Common.AlbumArtistsServicePostApiByLibraryIdAlbumArtistsByIdFavoriteMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => AlbumArtistsService.postApiByLibraryIdAlbumArtistsByIdFavorite({ id }) as unknown as Promise<TData>, ...options });
export const useUsersServicePutApiUsersById = <TData = Common.UsersServicePutApiUsersByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody?: { displayName?: string; isAdmin?: boolean; isEnabled?: boolean; password?: string; username?: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody?: { displayName?: string; isAdmin?: boolean; isEnabled?: boolean; password?: string; username?: string; };
}, TContext>({ mutationFn: ({ id, requestBody }) => UsersService.putApiUsersById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useLibrariesServicePutApiLibrariesById = <TData = Common.LibrariesServicePutApiLibrariesByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody?: { baseUrl: string; displayName: string; isPublic?: boolean; password: string; type: "JELLYFIN" | "NAVIDROME" | "SUBSONIC"; username: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody?: { baseUrl: string; displayName: string; isPublic?: boolean; password: string; type: "JELLYFIN" | "NAVIDROME" | "SUBSONIC"; username: string; };
}, TContext>({ mutationFn: ({ id, requestBody }) => LibrariesService.putApiLibrariesById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useUsersServiceDeleteApiUsersById = <TData = Common.UsersServiceDeleteApiUsersByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => UsersService.deleteApiUsersById({ id }) as unknown as Promise<TData>, ...options });
export const useLibrariesServiceDeleteApiLibrariesById = <TData = Common.LibrariesServiceDeleteApiLibrariesByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => LibrariesService.deleteApiLibrariesById({ id }) as unknown as Promise<TData>, ...options });
export const useAlbumsServiceDeleteApiByLibraryIdAlbumsByIdFavorite = <TData = Common.AlbumsServiceDeleteApiByLibraryIdAlbumsByIdFavoriteMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => AlbumsService.deleteApiByLibraryIdAlbumsByIdFavorite({ id }) as unknown as Promise<TData>, ...options });
export const useTracksServiceDeleteApiByLibraryIdTracksByIdFavorite = <TData = Common.TracksServiceDeleteApiByLibraryIdTracksByIdFavoriteMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => TracksService.deleteApiByLibraryIdTracksByIdFavorite({ id }) as unknown as Promise<TData>, ...options });
export const useAlbumArtistsServiceDeleteApiByLibraryIdAlbumArtistsByIdFavorite = <TData = Common.AlbumArtistsServiceDeleteApiByLibraryIdAlbumArtistsByIdFavoriteMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => AlbumArtistsService.deleteApiByLibraryIdAlbumArtistsByIdFavorite({ id }) as unknown as Promise<TData>, ...options });
