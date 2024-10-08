/**
 * Generated by orval v7.1.1 🍺
 * Do not edit manually.
 * Audioling API
 * OpenAPI spec version: 1.0.0
 */
import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import type {
    InfiniteData,
    QueryFunction,
    QueryKey,
    UseSuspenseInfiniteQueryOptions,
    UseSuspenseInfiniteQueryResult,
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

    return {
        queryKey,
        queryFn,
        enabled: !!(libraryId && id),
        ...queryOptions,
    } as UseSuspenseQueryOptions<
        Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
        TError,
        TData
    > & { queryKey: QueryKey };
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
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
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
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
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
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
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
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey } {
    const queryOptions = getGetApiLibraryIdImagesIdSuspenseQueryOptions(
        libraryId,
        id,
        params,
        options,
    );

    const query = useSuspenseQuery(queryOptions) as UseSuspenseQueryResult<TData, TError> & {
        queryKey: QueryKey;
    };

    query.queryKey = queryOptions.queryKey;

    return query;
}

export const getGetApiLibraryIdImagesIdSuspenseInfiniteQueryOptions = <
    TData = InfiniteData<Awaited<ReturnType<typeof getApiLibraryIdImagesId>>>,
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
            UseSuspenseInfiniteQueryOptions<
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

    return {
        queryKey,
        queryFn,
        enabled: !!(libraryId && id),
        ...queryOptions,
    } as UseSuspenseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
        TError,
        TData
    > & { queryKey: QueryKey };
};

export type GetApiLibraryIdImagesIdSuspenseInfiniteQueryResult = NonNullable<
    Awaited<ReturnType<typeof getApiLibraryIdImagesId>>
>;
export type GetApiLibraryIdImagesIdSuspenseInfiniteQueryError = ErrorType<
    | GetApiLibraryIdImagesId401
    | GetApiLibraryIdImagesId403
    | GetApiLibraryIdImagesId404
    | GetApiLibraryIdImagesId422
    | GetApiLibraryIdImagesId500
>;

export function useGetApiLibraryIdImagesIdSuspenseInfinite<
    TData = InfiniteData<Awaited<ReturnType<typeof getApiLibraryIdImagesId>>>,
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
            UseSuspenseInfiniteQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey };
export function useGetApiLibraryIdImagesIdSuspenseInfinite<
    TData = InfiniteData<Awaited<ReturnType<typeof getApiLibraryIdImagesId>>>,
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
            UseSuspenseInfiniteQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey };
export function useGetApiLibraryIdImagesIdSuspenseInfinite<
    TData = InfiniteData<Awaited<ReturnType<typeof getApiLibraryIdImagesId>>>,
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
            UseSuspenseInfiniteQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey };
/**
 * @summary Get image by id
 */

export function useGetApiLibraryIdImagesIdSuspenseInfinite<
    TData = InfiniteData<Awaited<ReturnType<typeof getApiLibraryIdImagesId>>>,
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
            UseSuspenseInfiniteQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdImagesId>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
    const queryOptions = getGetApiLibraryIdImagesIdSuspenseInfiniteQueryOptions(
        libraryId,
        id,
        params,
        options,
    );

    const query = useSuspenseInfiniteQuery(queryOptions) as UseSuspenseInfiniteQueryResult<
        TData,
        TError
    > & { queryKey: QueryKey };

    query.queryKey = queryOptions.queryKey;

    return query;
}
