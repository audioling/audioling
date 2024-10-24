/**
 * Generated by orval v7.1.1 🍺
 * Do not edit manually.
 * Audioling API
 * OpenAPI spec version: 1.0.0
 */
import { useSuspenseQuery } from '@tanstack/react-query';
import type {
    QueryFunction,
    QueryKey,
    UseSuspenseQueryOptions,
    UseSuspenseQueryResult,
} from '@tanstack/react-query';
import type {
    GetApiLibraryIdGenres200,
    GetApiLibraryIdGenres401,
    GetApiLibraryIdGenres403,
    GetApiLibraryIdGenres422,
    GetApiLibraryIdGenres500,
    GetApiLibraryIdGenresParams,
} from '../audioling-openapi-client.schemas.ts';
import { apiInstance } from '../../api-instance.ts';
import type { ErrorType } from '../../api-instance.ts';

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

/**
 * @summary Get all genres
 */
export const getApiLibraryIdGenres = (
    libraryId: string,
    params: GetApiLibraryIdGenresParams,
    options?: SecondParameter<typeof apiInstance>,
    signal?: AbortSignal,
) => {
    return apiInstance<GetApiLibraryIdGenres200>(
        { url: `/api/${libraryId}/genres`, method: 'GET', params, signal },
        options,
    );
};

export const getGetApiLibraryIdGenresQueryKey = (
    libraryId: string,
    params: GetApiLibraryIdGenresParams,
) => {
    return [`/api/${libraryId}/genres`, ...(params ? [params] : [])] as const;
};

export const getGetApiLibraryIdGenresSuspenseQueryOptions = <
    TData = Awaited<ReturnType<typeof getApiLibraryIdGenres>>,
    TError = ErrorType<
        | GetApiLibraryIdGenres401
        | GetApiLibraryIdGenres403
        | GetApiLibraryIdGenres422
        | GetApiLibraryIdGenres500
    >,
>(
    libraryId: string,
    params: GetApiLibraryIdGenresParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdGenres>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
) => {
    const { query: queryOptions, request: requestOptions } = options ?? {};

    const queryKey = queryOptions?.queryKey ?? getGetApiLibraryIdGenresQueryKey(libraryId, params);

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiLibraryIdGenres>>> = ({
        signal,
    }) => getApiLibraryIdGenres(libraryId, params, requestOptions, signal);

    return {
        queryKey,
        queryFn,
        enabled: !!libraryId,
        staleTime: 10000,
        ...queryOptions,
    } as UseSuspenseQueryOptions<
        Awaited<ReturnType<typeof getApiLibraryIdGenres>>,
        TError,
        TData
    > & { queryKey: QueryKey };
};

export type GetApiLibraryIdGenresSuspenseQueryResult = NonNullable<
    Awaited<ReturnType<typeof getApiLibraryIdGenres>>
>;
export type GetApiLibraryIdGenresSuspenseQueryError = ErrorType<
    | GetApiLibraryIdGenres401
    | GetApiLibraryIdGenres403
    | GetApiLibraryIdGenres422
    | GetApiLibraryIdGenres500
>;

export function useGetApiLibraryIdGenresSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdGenres>>,
    TError = ErrorType<
        | GetApiLibraryIdGenres401
        | GetApiLibraryIdGenres403
        | GetApiLibraryIdGenres422
        | GetApiLibraryIdGenres500
    >,
>(
    libraryId: string,
    params: GetApiLibraryIdGenresParams,
    options: {
        query: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdGenres>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
export function useGetApiLibraryIdGenresSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdGenres>>,
    TError = ErrorType<
        | GetApiLibraryIdGenres401
        | GetApiLibraryIdGenres403
        | GetApiLibraryIdGenres422
        | GetApiLibraryIdGenres500
    >,
>(
    libraryId: string,
    params: GetApiLibraryIdGenresParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdGenres>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
export function useGetApiLibraryIdGenresSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdGenres>>,
    TError = ErrorType<
        | GetApiLibraryIdGenres401
        | GetApiLibraryIdGenres403
        | GetApiLibraryIdGenres422
        | GetApiLibraryIdGenres500
    >,
>(
    libraryId: string,
    params: GetApiLibraryIdGenresParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdGenres>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
/**
 * @summary Get all genres
 */

export function useGetApiLibraryIdGenresSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdGenres>>,
    TError = ErrorType<
        | GetApiLibraryIdGenres401
        | GetApiLibraryIdGenres403
        | GetApiLibraryIdGenres422
        | GetApiLibraryIdGenres500
    >,
>(
    libraryId: string,
    params: GetApiLibraryIdGenresParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdGenres>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey } {
    const queryOptions = getGetApiLibraryIdGenresSuspenseQueryOptions(libraryId, params, options);

    const query = useSuspenseQuery(queryOptions) as UseSuspenseQueryResult<TData, TError> & {
        queryKey: QueryKey;
    };

    query.queryKey = queryOptions.queryKey;

    return query;
}
