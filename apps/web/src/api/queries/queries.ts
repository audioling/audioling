// generated with @7nohe/openapi-react-query-codegen@1.4.1 

import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { AlbumsService, AuthService, JobsService, LibrariesService, RootService, UsersService } from "../requests/services.gen";
import * as Common from "./common";
export const useRootServiceGetPing = <TData = Common.RootServiceGetPingDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRootServiceGetPingKeyFn(queryKey), queryFn: () => RootService.getPing() as TData, ...options });
export const useUsersServiceGetApiUsers = <TData = Common.UsersServiceGetApiUsersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetApiUsersKeyFn(queryKey), queryFn: () => UsersService.getApiUsers() as TData, ...options });
export const useUsersServiceGetApiUsersById = <TData = Common.UsersServiceGetApiUsersByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetApiUsersByIdKeyFn(queryKey), queryFn: () => UsersService.getApiUsersById() as TData, ...options });
export const useLibrariesServiceGetApiLibraries = <TData = Common.LibrariesServiceGetApiLibrariesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLibrariesServiceGetApiLibrariesKeyFn(queryKey), queryFn: () => LibrariesService.getApiLibraries() as TData, ...options });
export const useLibrariesServiceGetApiLibrariesById = <TData = Common.LibrariesServiceGetApiLibrariesByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLibrariesServiceGetApiLibrariesByIdKeyFn(queryKey), queryFn: () => LibrariesService.getApiLibrariesById() as TData, ...options });
export const useJobsServiceGetApiJobs = <TData = Common.JobsServiceGetApiJobsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseJobsServiceGetApiJobsKeyFn(queryKey), queryFn: () => JobsService.getApiJobs() as TData, ...options });
export const useAlbumsServiceGetApiAlbums = <TData = Common.AlbumsServiceGetApiAlbumsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ libraryId, limit, offset, orderBy }: {
  libraryId?: string[];
  limit: string;
  offset: string;
  orderBy?: string[];
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAlbumsServiceGetApiAlbumsKeyFn({ libraryId, limit, offset, orderBy }, queryKey), queryFn: () => AlbumsService.getApiAlbums({ libraryId, limit, offset, orderBy }) as TData, ...options });
export const useAlbumsServiceGetApiAlbumsById = <TData = Common.AlbumsServiceGetApiAlbumsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAlbumsServiceGetApiAlbumsByIdKeyFn({ id }, queryKey), queryFn: () => AlbumsService.getApiAlbumsById({ id }) as TData, ...options });
export const useAuthServicePostAuthSignIn = <TData = Common.AuthServicePostAuthSignInMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: { password: string; username: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: { password: string; username: string; };
}, TContext>({ mutationFn: ({ requestBody }) => AuthService.postAuthSignIn({ requestBody }) as unknown as Promise<TData>, ...options });
export const useAuthServicePostAuthSignOut = <TData = Common.AuthServicePostAuthSignOutMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: { refreshToken?: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: { refreshToken?: string; };
}, TContext>({ mutationFn: ({ requestBody }) => AuthService.postAuthSignOut({ requestBody }) as unknown as Promise<TData>, ...options });
export const useUsersServicePostApiUsers = <TData = Common.UsersServicePostApiUsersMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: { displayName?: string; password: string; username: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: { displayName?: string; password: string; username: string; };
}, TContext>({ mutationFn: ({ requestBody }) => UsersService.postApiUsers({ requestBody }) as unknown as Promise<TData>, ...options });
export const useLibrariesServicePostApiLibraries = <TData = Common.LibrariesServicePostApiLibrariesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: { name: string; password: string; type: string; url: string; username: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: { name: string; password: string; type: string; url: string; username: string; };
}, TContext>({ mutationFn: ({ requestBody }) => LibrariesService.postApiLibraries({ requestBody }) as unknown as Promise<TData>, ...options });
export const useJobsServicePostApiJobs = <TData = Common.JobsServicePostApiJobsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => JobsService.postApiJobs() as unknown as Promise<TData>, ...options });
export const useUsersServicePutApiUsersById = <TData = Common.UsersServicePutApiUsersByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: { displayName?: string; password: string; username: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: { displayName?: string; password: string; username: string; };
}, TContext>({ mutationFn: ({ requestBody }) => UsersService.putApiUsersById({ requestBody }) as unknown as Promise<TData>, ...options });
export const useLibrariesServicePutApiLibrariesById = <TData = Common.LibrariesServicePutApiLibrariesByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: { name: string; password: string; type: string; url: string; username: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: { name: string; password: string; type: string; url: string; username: string; };
}, TContext>({ mutationFn: ({ requestBody }) => LibrariesService.putApiLibrariesById({ requestBody }) as unknown as Promise<TData>, ...options });
export const useUsersServiceDeleteApiUsersById = <TData = Common.UsersServiceDeleteApiUsersByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => UsersService.deleteApiUsersById() as unknown as Promise<TData>, ...options });
export const useLibrariesServiceDeleteApiLibrariesById = <TData = Common.LibrariesServiceDeleteApiLibrariesByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => LibrariesService.deleteApiLibrariesById() as unknown as Promise<TData>, ...options });
export const useJobsServiceDeleteApiJobsById = <TData = Common.JobsServiceDeleteApiJobsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => JobsService.deleteApiJobsById({ id }) as unknown as Promise<TData>, ...options });
