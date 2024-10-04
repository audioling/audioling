// generated with @7nohe/openapi-react-query-codegen@1.6.1 

import { UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { AlbumArtistsService, AlbumsService, GenresService, LibrariesService, RootService, TracksService, UsersService } from "../requests/services.gen";
import * as Common from "./common";
export const useRootServiceGetPingSuspense = <TData = Common.RootServiceGetPingDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRootServiceGetPingKeyFn(queryKey), queryFn: () => RootService.getPing() as TData, ...options });
export const useUsersServiceGetApiUsersSuspense = <TData = Common.UsersServiceGetApiUsersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, sortBy, sortOrder }: {
  limit?: string;
  offset?: string;
  sortBy: "createdAt" | "displayName" | "name" | "updatedAt";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetApiUsersKeyFn({ limit, offset, sortBy, sortOrder }, queryKey), queryFn: () => UsersService.getApiUsers({ limit, offset, sortBy, sortOrder }) as TData, ...options });
export const useUsersServiceGetApiUsersByIdSuspense = <TData = Common.UsersServiceGetApiUsersByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetApiUsersByIdKeyFn({ id }, queryKey), queryFn: () => UsersService.getApiUsersById({ id }) as TData, ...options });
export const useLibrariesServiceGetApiLibrariesSuspense = <TData = Common.LibrariesServiceGetApiLibrariesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, sortBy, sortOrder }: {
  limit?: string;
  offset?: string;
  sortBy: "createdAt" | "name" | "updatedAt" | "type";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLibrariesServiceGetApiLibrariesKeyFn({ limit, offset, sortBy, sortOrder }, queryKey), queryFn: () => LibrariesService.getApiLibraries({ limit, offset, sortBy, sortOrder }) as TData, ...options });
export const useLibrariesServiceGetApiLibrariesByIdSuspense = <TData = Common.LibrariesServiceGetApiLibrariesByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLibrariesServiceGetApiLibrariesByIdKeyFn({ id }, queryKey), queryFn: () => LibrariesService.getApiLibrariesById({ id }) as TData, ...options });
export const useAlbumsServiceGetApiByLibraryIdAlbumsSuspense = <TData = Common.AlbumsServiceGetApiByLibraryIdAlbumsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ folderId, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "communityRating" | "criticRating" | "dateAdded" | "datePlayed" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "trackCount" | "year";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAlbumsServiceGetApiByLibraryIdAlbumsKeyFn({ folderId, limit, offset, searchTerm, sortBy, sortOrder }, queryKey), queryFn: () => AlbumsService.getApiByLibraryIdAlbums({ folderId, limit, offset, searchTerm, sortBy, sortOrder }) as TData, ...options });
export const useAlbumsServiceGetApiByLibraryIdAlbumsByIdSuspense = <TData = Common.AlbumsServiceGetApiByLibraryIdAlbumsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  id: string;
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "year" | "album" | "bpm" | "channels" | "comment" | "genre" | "id" | "rating" | "recentlyAdded" | "recentlyPlayed";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAlbumsServiceGetApiByLibraryIdAlbumsByIdKeyFn({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }, queryKey), queryFn: () => AlbumsService.getApiByLibraryIdAlbumsById({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }) as TData, ...options });
export const useTracksServiceGetApiByLibraryIdTracksSuspense = <TData = Common.TracksServiceGetApiByLibraryIdTracksDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ folderId, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "year" | "album" | "bpm" | "channels" | "comment" | "genre" | "id" | "rating" | "recentlyAdded" | "recentlyPlayed";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTracksServiceGetApiByLibraryIdTracksKeyFn({ folderId, limit, offset, searchTerm, sortBy, sortOrder }, queryKey), queryFn: () => TracksService.getApiByLibraryIdTracks({ folderId, limit, offset, searchTerm, sortBy, sortOrder }) as TData, ...options });
export const useTracksServiceGetApiByLibraryIdTracksByIdSuspense = <TData = Common.TracksServiceGetApiByLibraryIdTracksByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTracksServiceGetApiByLibraryIdTracksByIdKeyFn({ id }, queryKey), queryFn: () => TracksService.getApiByLibraryIdTracksById({ id }) as TData, ...options });
export const useAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsSuspense = <TData = Common.AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ folderId, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "dateAdded" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "trackCount" | "album" | "rating" | "albumCount";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsKeyFn({ folderId, limit, offset, searchTerm, sortBy, sortOrder }, queryKey), queryFn: () => AlbumArtistsService.getApiByLibraryIdAlbumArtists({ folderId, limit, offset, searchTerm, sortBy, sortOrder }) as TData, ...options });
export const useAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdSuspense = <TData = Common.AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdKeyFn({ id }, queryKey), queryFn: () => AlbumArtistsService.getApiByLibraryIdAlbumArtistsById({ id }) as TData, ...options });
export const useAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdAlbumsSuspense = <TData = Common.AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdAlbumsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  id: string;
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "communityRating" | "criticRating" | "dateAdded" | "datePlayed" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "trackCount" | "year";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdAlbumsKeyFn({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }, queryKey), queryFn: () => AlbumArtistsService.getApiByLibraryIdAlbumArtistsByIdAlbums({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }) as TData, ...options });
export const useAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdTracksSuspense = <TData = Common.AlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdTracksDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  id: string;
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "year" | "album" | "bpm" | "channels" | "comment" | "genre" | "id" | "rating" | "recentlyAdded" | "recentlyPlayed";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdTracksKeyFn({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }, queryKey), queryFn: () => AlbumArtistsService.getApiByLibraryIdAlbumArtistsByIdTracks({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }) as TData, ...options });
export const useGenresServiceGetApiByLibraryIdGenresSuspense = <TData = Common.GenresServiceGetApiByLibraryIdGenresDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ folderId, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "trackCount" | "albumCount";
  sortOrder: "asc" | "desc";
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGenresServiceGetApiByLibraryIdGenresKeyFn({ folderId, limit, offset, searchTerm, sortBy, sortOrder }, queryKey), queryFn: () => GenresService.getApiByLibraryIdGenres({ folderId, limit, offset, searchTerm, sortBy, sortOrder }) as TData, ...options });
