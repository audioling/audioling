/**
 * Generated by orval v7.4.1 🍺
 * Do not edit manually.
 * Audioling API
 * OpenAPI spec version: 1.0.0
 */
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import type {
    DataTag,
    DefinedInitialDataOptions,
    DefinedUseQueryResult,
    QueryFunction,
    QueryKey,
    UndefinedInitialDataOptions,
    UseQueryOptions,
    UseQueryResult,
    UseSuspenseQueryOptions,
    UseSuspenseQueryResult,
} from '@tanstack/react-query';
import type {
    GetApiLibraryIdImagesId401,
    GetApiLibraryIdImagesId403,
    GetApiLibraryIdImagesId404,
    GetApiLibraryIdImagesId422,
    GetApiLibraryIdImagesId500,
    GetApiLibraryIdImagesIdParams,
} from '../audioling-openapi-client.schemas.ts';
import { apiInstance } from '../../api-instance.ts';
import type { ErrorType } from '../../api-instance.ts';

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

/**
 * @summary Get image by id
 */
export const getApiLibraryIdImagesId = (
    libraryId: string,
    id: string,
    params: GetApiLibraryIdImagesIdParams,
    options?: SecondParameter<typeof apiInstance>,
    signal?: AbortSignal,
) => {
    return apiInstance<string>(
        { url: `/api/${libraryId}/images/${id}`, method: 'GET', params, signal },
        options,
    );
};

export const getGetApiLibraryIdImagesIdQueryKey = (
    libraryId: string,
    id: string,
    params: GetApiLibraryIdImagesIdParams,
) => {
    return [`/api/${libraryId}/images/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetApiLibraryIdImagesIdQueryOptions = <
    TData = Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
    TError = ErrorType<
        | GetApiLibraryIdImagesId401
        | GetApiLibraryIdImagesId403
        | GetApiLibraryIdImagesId404
        | GetApiLibraryIdImagesId422
        | GetApiLibraryIdImagesId500
    >,
>(
    libraryId: string,
    id: string,
    params: GetApiLibraryIdImagesIdParams,
    options?: {
        query?: Partial<
            UseQueryOptions<Awaited<ReturnType<typeof getApiLibraryIdImagesId>>, TError, TData>
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
) => {
    const { query: queryOptions, request: requestOptions } = options ?? {};

    const queryKey =
        queryOptions?.queryKey ?? getGetApiLibraryIdImagesIdQueryKey(libraryId, id, params);

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiLibraryIdImagesId>>> = ({
        signal,
    }) => getApiLibraryIdImagesId(libraryId, id, params, requestOptions, signal);

    return {
        queryKey,
        queryFn,
        enabled: !!(libraryId && id),
        staleTime: 10000,
        ...queryOptions,
    } as UseQueryOptions<Awaited<ReturnType<typeof getApiLibraryIdImagesId>>, TError, TData> & {
        queryKey: DataTag<QueryKey, TData, TError>;
    };
};

export type GetApiLibraryIdImagesIdQueryResult = NonNullable<
    Awaited<ReturnType<typeof getApiLibraryIdImagesId>>
>;
export type GetApiLibraryIdImagesIdQueryError = ErrorType<
    | GetApiLibraryIdImagesId401
    | GetApiLibraryIdImagesId403
    | GetApiLibraryIdImagesId404
    | GetApiLibraryIdImagesId422
    | GetApiLibraryIdImagesId500
>;

export function useGetApiLibraryIdImagesId<
    TData = Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
    TError = ErrorType<
        | GetApiLibraryIdImagesId401
        | GetApiLibraryIdImagesId403
        | GetApiLibraryIdImagesId404
        | GetApiLibraryIdImagesId422
        | GetApiLibraryIdImagesId500
    >,
>(
    libraryId: string,
    id: string,
    params: GetApiLibraryIdImagesIdParams,
    options: {
        query: Partial<
            UseQueryOptions<Awaited<ReturnType<typeof getApiLibraryIdImagesId>>, TError, TData>
        > &
            Pick<
                DefinedInitialDataOptions<
                    Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
                    TError,
                    TData
                >,
                'initialData'
            >;
        request?: SecondParameter<typeof apiInstance>;
    },
): DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };
export function useGetApiLibraryIdImagesId<
    TData = Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
    TError = ErrorType<
        | GetApiLibraryIdImagesId401
        | GetApiLibraryIdImagesId403
        | GetApiLibraryIdImagesId404
        | GetApiLibraryIdImagesId422
        | GetApiLibraryIdImagesId500
    >,
>(
    libraryId: string,
    id: string,
    params: GetApiLibraryIdImagesIdParams,
    options?: {
        query?: Partial<
            UseQueryOptions<Awaited<ReturnType<typeof getApiLibraryIdImagesId>>, TError, TData>
        > &
            Pick<
                UndefinedInitialDataOptions<
                    Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
                    TError,
                    TData
                >,
                'initialData'
            >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };
export function useGetApiLibraryIdImagesId<
    TData = Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
    TError = ErrorType<
        | GetApiLibraryIdImagesId401
        | GetApiLibraryIdImagesId403
        | GetApiLibraryIdImagesId404
        | GetApiLibraryIdImagesId422
        | GetApiLibraryIdImagesId500
    >,
>(
    libraryId: string,
    id: string,
    params: GetApiLibraryIdImagesIdParams,
    options?: {
        query?: Partial<
            UseQueryOptions<Awaited<ReturnType<typeof getApiLibraryIdImagesId>>, TError, TData>
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };
/**
 * @summary Get image by id
 */

export function useGetApiLibraryIdImagesId<
    TData = Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
    TError = ErrorType<
        | GetApiLibraryIdImagesId401
        | GetApiLibraryIdImagesId403
        | GetApiLibraryIdImagesId404
        | GetApiLibraryIdImagesId422
        | GetApiLibraryIdImagesId500
    >,
>(
    libraryId: string,
    id: string,
    params: GetApiLibraryIdImagesIdParams,
    options?: {
        query?: Partial<
            UseQueryOptions<Awaited<ReturnType<typeof getApiLibraryIdImagesId>>, TError, TData>
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {
    const queryOptions = getGetApiLibraryIdImagesIdQueryOptions(libraryId, id, params, options);

    const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
        queryKey: DataTag<QueryKey, TData, TError>;
    };

    query.queryKey = queryOptions.queryKey;

    return query;
}

export const getGetApiLibraryIdImagesIdSuspenseQueryOptions = <
    TData = Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
    TError = ErrorType<
        | GetApiLibraryIdImagesId401
        | GetApiLibraryIdImagesId403
        | GetApiLibraryIdImagesId404
        | GetApiLibraryIdImagesId422
        | GetApiLibraryIdImagesId500
    >,
>(
    libraryId: string,
    id: string,
    params: GetApiLibraryIdImagesIdParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
) => {
    const { query: queryOptions, request: requestOptions } = options ?? {};

    const queryKey =
        queryOptions?.queryKey ?? getGetApiLibraryIdImagesIdQueryKey(libraryId, id, params);

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiLibraryIdImagesId>>> = ({
        signal,
    }) => getApiLibraryIdImagesId(libraryId, id, params, requestOptions, signal);

    return { queryKey, queryFn, staleTime: 10000, ...queryOptions } as UseSuspenseQueryOptions<
        Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
        TError,
        TData
    > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetApiLibraryIdImagesIdSuspenseQueryResult = NonNullable<
    Awaited<ReturnType<typeof getApiLibraryIdImagesId>>
>;
export type GetApiLibraryIdImagesIdSuspenseQueryError = ErrorType<
    | GetApiLibraryIdImagesId401
    | GetApiLibraryIdImagesId403
    | GetApiLibraryIdImagesId404
    | GetApiLibraryIdImagesId422
    | GetApiLibraryIdImagesId500
>;

export function useGetApiLibraryIdImagesIdSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
    TError = ErrorType<
        | GetApiLibraryIdImagesId401
        | GetApiLibraryIdImagesId403
        | GetApiLibraryIdImagesId404
        | GetApiLibraryIdImagesId422
        | GetApiLibraryIdImagesId500
    >,
>(
    libraryId: string,
    id: string,
    params: GetApiLibraryIdImagesIdParams,
    options: {
        query: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };
export function useGetApiLibraryIdImagesIdSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
    TError = ErrorType<
        | GetApiLibraryIdImagesId401
        | GetApiLibraryIdImagesId403
        | GetApiLibraryIdImagesId404
        | GetApiLibraryIdImagesId422
        | GetApiLibraryIdImagesId500
    >,
>(
    libraryId: string,
    id: string,
    params: GetApiLibraryIdImagesIdParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };
export function useGetApiLibraryIdImagesIdSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
    TError = ErrorType<
        | GetApiLibraryIdImagesId401
        | GetApiLibraryIdImagesId403
        | GetApiLibraryIdImagesId404
        | GetApiLibraryIdImagesId422
        | GetApiLibraryIdImagesId500
    >,
>(
    libraryId: string,
    id: string,
    params: GetApiLibraryIdImagesIdParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };
/**
 * @summary Get image by id
 */

export function useGetApiLibraryIdImagesIdSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
    TError = ErrorType<
        | GetApiLibraryIdImagesId401
        | GetApiLibraryIdImagesId403
        | GetApiLibraryIdImagesId404
        | GetApiLibraryIdImagesId422
        | GetApiLibraryIdImagesId500
    >,
>(
    libraryId: string,
    id: string,
    params: GetApiLibraryIdImagesIdParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {
    const queryOptions = getGetApiLibraryIdImagesIdSuspenseQueryOptions(
        libraryId,
        id,
        params,
        options,
    );

    const query = useSuspenseQuery(queryOptions) as UseSuspenseQueryResult<TData, TError> & {
        queryKey: DataTag<QueryKey, TData, TError>;
    };

    query.queryKey = queryOptions.queryKey;

    return query;
}
