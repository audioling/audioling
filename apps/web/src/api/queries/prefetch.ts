// generated with @7nohe/openapi-react-query-codegen@1.6.1 

import { type QueryClient } from "@tanstack/react-query";
import { AlbumArtistsService, AlbumsService, GenresService, LibrariesService, RootService, TracksService, UsersService } from "../requests/services.gen";
import * as Common from "./common";
export const prefetchUseRootServiceGetPing = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseRootServiceGetPingKeyFn(), queryFn: () => RootService.getPing() });
export const prefetchUseUsersServiceGetApiUsers = (queryClient: QueryClient, { limit, offset, sortBy, sortOrder }: {
  limit?: string;
  offset?: string;
  sortBy: "createdAt" | "displayName" | "name" | "updatedAt";
  sortOrder: "asc" | "desc";
}) => queryClient.prefetchQuery({ queryKey: Common.UseUsersServiceGetApiUsersKeyFn({ limit, offset, sortBy, sortOrder }), queryFn: () => UsersService.getApiUsers({ limit, offset, sortBy, sortOrder }) });
export const prefetchUseUsersServiceGetApiUsersById = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseUsersServiceGetApiUsersByIdKeyFn({ id }), queryFn: () => UsersService.getApiUsersById({ id }) });
export const prefetchUseLibrariesServiceGetApiLibraries = (queryClient: QueryClient, { limit, offset, sortBy, sortOrder }: {
  limit?: string;
  offset?: string;
  sortBy: "createdAt" | "name" | "updatedAt" | "type";
  sortOrder: "asc" | "desc";
}) => queryClient.prefetchQuery({ queryKey: Common.UseLibrariesServiceGetApiLibrariesKeyFn({ limit, offset, sortBy, sortOrder }), queryFn: () => LibrariesService.getApiLibraries({ limit, offset, sortBy, sortOrder }) });
export const prefetchUseLibrariesServiceGetApiLibrariesById = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLibrariesServiceGetApiLibrariesByIdKeyFn({ id }), queryFn: () => LibrariesService.getApiLibrariesById({ id }) });
export const prefetchUseAlbumsServiceGetApiByLibraryIdAlbums = (queryClient: QueryClient, { folderId, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "communityRating" | "criticRating" | "dateAdded" | "datePlayed" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "trackCount" | "year";
  sortOrder: "asc" | "desc";
}) => queryClient.prefetchQuery({ queryKey: Common.UseAlbumsServiceGetApiByLibraryIdAlbumsKeyFn({ folderId, limit, offset, searchTerm, sortBy, sortOrder }), queryFn: () => AlbumsService.getApiByLibraryIdAlbums({ folderId, limit, offset, searchTerm, sortBy, sortOrder }) });
export const prefetchUseAlbumsServiceGetApiByLibraryIdAlbumsById = (queryClient: QueryClient, { folderId, id, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  id: string;
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "year" | "album" | "bpm" | "channels" | "comment" | "genre" | "id" | "rating" | "recentlyAdded" | "recentlyPlayed";
  sortOrder: "asc" | "desc";
}) => queryClient.prefetchQuery({ queryKey: Common.UseAlbumsServiceGetApiByLibraryIdAlbumsByIdKeyFn({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }), queryFn: () => AlbumsService.getApiByLibraryIdAlbumsById({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }) });
export const prefetchUseTracksServiceGetApiByLibraryIdTracks = (queryClient: QueryClient, { folderId, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "year" | "album" | "bpm" | "channels" | "comment" | "genre" | "id" | "rating" | "recentlyAdded" | "recentlyPlayed";
  sortOrder: "asc" | "desc";
}) => queryClient.prefetchQuery({ queryKey: Common.UseTracksServiceGetApiByLibraryIdTracksKeyFn({ folderId, limit, offset, searchTerm, sortBy, sortOrder }), queryFn: () => TracksService.getApiByLibraryIdTracks({ folderId, limit, offset, searchTerm, sortBy, sortOrder }) });
export const prefetchUseTracksServiceGetApiByLibraryIdTracksById = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseTracksServiceGetApiByLibraryIdTracksByIdKeyFn({ id }), queryFn: () => TracksService.getApiByLibraryIdTracksById({ id }) });
export const prefetchUseAlbumArtistsServiceGetApiByLibraryIdAlbumArtists = (queryClient: QueryClient, { folderId, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "dateAdded" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "trackCount" | "album" | "rating" | "albumCount";
  sortOrder: "asc" | "desc";
}) => queryClient.prefetchQuery({ queryKey: Common.UseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsKeyFn({ folderId, limit, offset, searchTerm, sortBy, sortOrder }), queryFn: () => AlbumArtistsService.getApiByLibraryIdAlbumArtists({ folderId, limit, offset, searchTerm, sortBy, sortOrder }) });
export const prefetchUseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsById = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdKeyFn({ id }), queryFn: () => AlbumArtistsService.getApiByLibraryIdAlbumArtistsById({ id }) });
export const prefetchUseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdAlbums = (queryClient: QueryClient, { folderId, id, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  id: string;
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "communityRating" | "criticRating" | "dateAdded" | "datePlayed" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "trackCount" | "year";
  sortOrder: "asc" | "desc";
}) => queryClient.prefetchQuery({ queryKey: Common.UseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdAlbumsKeyFn({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }), queryFn: () => AlbumArtistsService.getApiByLibraryIdAlbumArtistsByIdAlbums({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }) });
export const prefetchUseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdTracks = (queryClient: QueryClient, { folderId, id, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  id: string;
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "albumArtist" | "artist" | "duration" | "isFavorite" | "playCount" | "random" | "releaseDate" | "year" | "album" | "bpm" | "channels" | "comment" | "genre" | "id" | "rating" | "recentlyAdded" | "recentlyPlayed";
  sortOrder: "asc" | "desc";
}) => queryClient.prefetchQuery({ queryKey: Common.UseAlbumArtistsServiceGetApiByLibraryIdAlbumArtistsByIdTracksKeyFn({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }), queryFn: () => AlbumArtistsService.getApiByLibraryIdAlbumArtistsByIdTracks({ folderId, id, limit, offset, searchTerm, sortBy, sortOrder }) });
export const prefetchUseGenresServiceGetApiByLibraryIdGenres = (queryClient: QueryClient, { folderId, limit, offset, searchTerm, sortBy, sortOrder }: {
  folderId?: string[];
  limit?: string;
  offset?: string;
  searchTerm?: string;
  sortBy: "name" | "trackCount" | "albumCount";
  sortOrder: "asc" | "desc";
}) => queryClient.prefetchQuery({ queryKey: Common.UseGenresServiceGetApiByLibraryIdGenresKeyFn({ folderId, limit, offset, searchTerm, sortBy, sortOrder }), queryFn: () => GenresService.getApiByLibraryIdGenres({ folderId, limit, offset, searchTerm, sortBy, sortOrder }) });
