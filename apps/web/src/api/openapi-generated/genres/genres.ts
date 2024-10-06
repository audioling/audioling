/**
 * Generated by orval v7.1.1 🍺
 * Do not edit manually.
 * Audioling API
 * OpenAPI spec version: 1.0.0
 */
import { useQuery } from '@tanstack/react-query';
import type {
    DefinedInitialDataOptions,
    DefinedUseQueryResult,
    QueryFunction,
    QueryKey,
    UndefinedInitialDataOptions,
    UseQueryOptions,
    UseQueryResult,
} from '@tanstack/react-query';
import { apiInstance } from '../../api-instance.ts';
import type { ErrorType } from '../../api-instance.ts';
import type {
    GetApiLibraryIdGenres200,
    GetApiLibraryIdGenres401,
    GetApiLibraryIdGenres403,
    GetApiLibraryIdGenres422,
    GetApiLibraryIdGenres500,
    GetApiLibraryIdGenresParams,
} from '../audioling-openapi-client.schemas.ts';

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
        { method: 'GET', params, signal, url: `/api/${libraryId}/genres` },
        options,
    );
};

export const getGetApiLibraryIdGenresQueryKey = (
    libraryId: string,
    params: GetApiLibraryIdGenresParams,
) => {
    return [`/api/${libraryId}/genres`, ...(params ? [params] : [])] as const;
};

export const getGetApiLibraryIdGenresQueryOptions = <
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
            UseQueryOptions<Awaited<ReturnType<typeof getApiLibraryIdGenres>>, TError, TData>
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
) => {
    const { query: queryOptions, request: requestOptions } = options ?? {};

    const queryKey = queryOptions?.queryKey ?? getGetApiLibraryIdGenresQueryKey(libraryId, params);

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiLibraryIdGenres>>> = ({
        signal,
    }) => getApiLibraryIdGenres(libraryId, params, requestOptions, signal);

    return { enabled: !!libraryId, queryFn, queryKey, ...queryOptions } as UseQueryOptions<
        Awaited<ReturnType<typeof getApiLibraryIdGenres>>,
        TError,
        TData
    > & { queryKey: QueryKey };
};

export type GetApiLibraryIdGenresQueryResult = NonNullable<
    Awaited<ReturnType<typeof getApiLibraryIdGenres>>
>;
export type GetApiLibraryIdGenresQueryError = ErrorType<
    | GetApiLibraryIdGenres401
    | GetApiLibraryIdGenres403
    | GetApiLibraryIdGenres422
    | GetApiLibraryIdGenres500
>;

export function useGetApiLibraryIdGenres<
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
            UseQueryOptions<Awaited<ReturnType<typeof getApiLibraryIdGenres>>, TError, TData>
        > &
            Pick<
                DefinedInitialDataOptions<
                    Awaited<ReturnType<typeof getApiLibraryIdGenres>>,
                    TError,
                    TData
                >,
                'initialData'
            >;
        request?: SecondParameter<typeof apiInstance>;
    },
): DefinedUseQueryResult<TData, TError> & { queryKey: QueryKey };
export function useGetApiLibraryIdGenres<
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
            UseQueryOptions<Awaited<ReturnType<typeof getApiLibraryIdGenres>>, TError, TData>
        > &
            Pick<
                UndefinedInitialDataOptions<
                    Awaited<ReturnType<typeof getApiLibraryIdGenres>>,
                    TError,
                    TData
                >,
                'initialData'
            >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseQueryResult<TData, TError> & { queryKey: QueryKey };
export function useGetApiLibraryIdGenres<
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
            UseQueryOptions<Awaited<ReturnType<typeof getApiLibraryIdGenres>>, TError, TData>
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseQueryResult<TData, TError> & { queryKey: QueryKey };
/**
 * @summary Get all genres
 */

export function useGetApiLibraryIdGenres<
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
            UseQueryOptions<Awaited<ReturnType<typeof getApiLibraryIdGenres>>, TError, TData>
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
    const queryOptions = getGetApiLibraryIdGenresQueryOptions(libraryId, params, options);

    const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

    query.queryKey = queryOptions.queryKey;

    return query;
}
