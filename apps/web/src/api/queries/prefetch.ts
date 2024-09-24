// generated with @7nohe/openapi-react-query-codegen@1.4.1 

import { type QueryClient } from "@tanstack/react-query";
import { AlbumsService, JobsService, LibrariesService, RootService, UsersService } from "../requests/services.gen";
import * as Common from "./common";
export const prefetchUseRootServiceGetPing = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseRootServiceGetPingKeyFn(), queryFn: () => RootService.getPing() });
export const prefetchUseUsersServiceGetApiUsers = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseUsersServiceGetApiUsersKeyFn(), queryFn: () => UsersService.getApiUsers() });
export const prefetchUseUsersServiceGetApiUsersById = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseUsersServiceGetApiUsersByIdKeyFn(), queryFn: () => UsersService.getApiUsersById() });
export const prefetchUseLibrariesServiceGetApiLibraries = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseLibrariesServiceGetApiLibrariesKeyFn(), queryFn: () => LibrariesService.getApiLibraries() });
export const prefetchUseLibrariesServiceGetApiLibrariesById = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseLibrariesServiceGetApiLibrariesByIdKeyFn(), queryFn: () => LibrariesService.getApiLibrariesById() });
export const prefetchUseJobsServiceGetApiJobs = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseJobsServiceGetApiJobsKeyFn(), queryFn: () => JobsService.getApiJobs() });
export const prefetchUseAlbumsServiceGetApiAlbums = (queryClient: QueryClient, { libraryId, limit, offset, orderBy }: {
  libraryId?: string[];
  limit: string;
  offset: string;
  orderBy?: string[];
}) => queryClient.prefetchQuery({ queryKey: Common.UseAlbumsServiceGetApiAlbumsKeyFn({ libraryId, limit, offset, orderBy }), queryFn: () => AlbumsService.getApiAlbums({ libraryId, limit, offset, orderBy }) });
export const prefetchUseAlbumsServiceGetApiAlbumsById = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseAlbumsServiceGetApiAlbumsByIdKeyFn({ id }), queryFn: () => AlbumsService.getApiAlbumsById({ id }) });
