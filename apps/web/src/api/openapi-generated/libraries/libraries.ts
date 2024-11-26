/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * Audioling API
 * OpenAPI spec version: 1.0.0
 */
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import type {
    DataTag,
    MutationFunction,
    QueryFunction,
    QueryKey,
    UseMutationOptions,
    UseMutationResult,
    UseSuspenseQueryOptions,
    UseSuspenseQueryResult,
} from '@tanstack/react-query';
import type {
    DeleteApiLibrariesId204,
    DeleteApiLibrariesId401,
    DeleteApiLibrariesId403,
    DeleteApiLibrariesId404,
    DeleteApiLibrariesId422,
    DeleteApiLibrariesId500,
    GetApiLibraries200,
    GetApiLibraries401,
    GetApiLibraries403,
    GetApiLibraries404,
    GetApiLibraries422,
    GetApiLibraries500,
    GetApiLibrariesId200,
    GetApiLibrariesId401,
    GetApiLibrariesId403,
    GetApiLibrariesId404,
    GetApiLibrariesId422,
    GetApiLibrariesId500,
    GetApiLibrariesParams,
    PostApiLibraries201,
    PostApiLibraries400,
    PostApiLibraries401,
    PostApiLibraries403,
    PostApiLibraries404,
    PostApiLibraries409,
    PostApiLibraries422,
    PostApiLibraries500,
    PostApiLibrariesBody,
    PostApiLibrariesIdAuth200,
    PostApiLibrariesIdAuth400,
    PostApiLibrariesIdAuth401,
    PostApiLibrariesIdAuth403,
    PostApiLibrariesIdAuth404,
    PostApiLibrariesIdAuth422,
    PostApiLibrariesIdAuth500,
    PostApiLibrariesIdAuthBody,
    PutApiLibrariesId200,
    PutApiLibrariesId400,
    PutApiLibrariesId401,
    PutApiLibrariesId403,
    PutApiLibrariesId404,
    PutApiLibrariesId422,
    PutApiLibrariesId500,
    PutApiLibrariesIdBody,
} from '../audioling-openapi-client.schemas.ts';
import { apiInstance } from '../../api-instance.ts';
import type { ErrorType, BodyType } from '../../api-instance.ts';

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

/**
 * @summary Get all libraries
 */
export const getApiLibraries = (
    params: GetApiLibrariesParams,
    options?: SecondParameter<typeof apiInstance>,
    signal?: AbortSignal,
) => {
    return apiInstance<GetApiLibraries200>(
        { url: `/api/libraries`, method: 'GET', params, signal },
        options,
    );
};

export const getGetApiLibrariesQueryKey = (params: GetApiLibrariesParams) => {
    return [`/api/libraries`, ...(params ? [params] : [])] as const;
};

export const getGetApiLibrariesSuspenseQueryOptions = <
    TData = Awaited<ReturnType<typeof getApiLibraries>>,
    TError = ErrorType<
        | GetApiLibraries401
        | GetApiLibraries403
        | GetApiLibraries404
        | GetApiLibraries422
        | GetApiLibraries500
    >,
>(
    params: GetApiLibrariesParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApiLibraries>>, TError, TData>
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
) => {
    const { query: queryOptions, request: requestOptions } = options ?? {};

    const queryKey = queryOptions?.queryKey ?? getGetApiLibrariesQueryKey(params);

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiLibraries>>> = ({ signal }) =>
        getApiLibraries(params, requestOptions, signal);

    return { queryKey, queryFn, staleTime: 10000, ...queryOptions } as UseSuspenseQueryOptions<
        Awaited<ReturnType<typeof getApiLibraries>>,
        TError,
        TData
    > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetApiLibrariesSuspenseQueryResult = NonNullable<
    Awaited<ReturnType<typeof getApiLibraries>>
>;
export type GetApiLibrariesSuspenseQueryError = ErrorType<
    | GetApiLibraries401
    | GetApiLibraries403
    | GetApiLibraries404
    | GetApiLibraries422
    | GetApiLibraries500
>;

export function useGetApiLibrariesSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraries>>,
    TError = ErrorType<
        | GetApiLibraries401
        | GetApiLibraries403
        | GetApiLibraries404
        | GetApiLibraries422
        | GetApiLibraries500
    >,
>(
    params: GetApiLibrariesParams,
    options: {
        query: Partial<
            UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApiLibraries>>, TError, TData>
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetApiLibrariesSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraries>>,
    TError = ErrorType<
        | GetApiLibraries401
        | GetApiLibraries403
        | GetApiLibraries404
        | GetApiLibraries422
        | GetApiLibraries500
    >,
>(
    params: GetApiLibrariesParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApiLibraries>>, TError, TData>
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetApiLibrariesSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraries>>,
    TError = ErrorType<
        | GetApiLibraries401
        | GetApiLibraries403
        | GetApiLibraries404
        | GetApiLibraries422
        | GetApiLibraries500
    >,
>(
    params: GetApiLibrariesParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApiLibraries>>, TError, TData>
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
/**
 * @summary Get all libraries
 */

export function useGetApiLibrariesSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraries>>,
    TError = ErrorType<
        | GetApiLibraries401
        | GetApiLibraries403
        | GetApiLibraries404
        | GetApiLibraries422
        | GetApiLibraries500
    >,
>(
    params: GetApiLibrariesParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApiLibraries>>, TError, TData>
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
    const queryOptions = getGetApiLibrariesSuspenseQueryOptions(params, options);

    const query = useSuspenseQuery(queryOptions) as UseSuspenseQueryResult<TData, TError> & {
        queryKey: DataTag<QueryKey, TData>;
    };

    query.queryKey = queryOptions.queryKey;

    return query;
}

/**
 * Create a library
 * @summary Create library
 */
export const postApiLibraries = (
    postApiLibrariesBody: BodyType<PostApiLibrariesBody>,
    options?: SecondParameter<typeof apiInstance>,
    signal?: AbortSignal,
) => {
    return apiInstance<PostApiLibraries201>(
        {
            url: `/api/libraries`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: postApiLibrariesBody,
            signal,
        },
        options,
    );
};

export const getPostApiLibrariesMutationOptions = <
    TError = ErrorType<
        | PostApiLibraries400
        | PostApiLibraries401
        | PostApiLibraries403
        | PostApiLibraries404
        | PostApiLibraries409
        | PostApiLibraries422
        | PostApiLibraries500
    >,
    TContext = unknown,
>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof postApiLibraries>>,
        TError,
        { data: BodyType<PostApiLibrariesBody> },
        TContext
    >;
    request?: SecondParameter<typeof apiInstance>;
}): UseMutationOptions<
    Awaited<ReturnType<typeof postApiLibraries>>,
    TError,
    { data: BodyType<PostApiLibrariesBody> },
    TContext
> => {
    const { mutation: mutationOptions, request: requestOptions } = options ?? {};

    const mutationFn: MutationFunction<
        Awaited<ReturnType<typeof postApiLibraries>>,
        { data: BodyType<PostApiLibrariesBody> }
    > = (props) => {
        const { data } = props ?? {};

        return postApiLibraries(data, requestOptions);
    };

    return { mutationFn, ...mutationOptions };
};

export type PostApiLibrariesMutationResult = NonNullable<
    Awaited<ReturnType<typeof postApiLibraries>>
>;
export type PostApiLibrariesMutationBody = BodyType<PostApiLibrariesBody>;
export type PostApiLibrariesMutationError = ErrorType<
    | PostApiLibraries400
    | PostApiLibraries401
    | PostApiLibraries403
    | PostApiLibraries404
    | PostApiLibraries409
    | PostApiLibraries422
    | PostApiLibraries500
>;

/**
 * @summary Create library
 */
export const usePostApiLibraries = <
    TError = ErrorType<
        | PostApiLibraries400
        | PostApiLibraries401
        | PostApiLibraries403
        | PostApiLibraries404
        | PostApiLibraries409
        | PostApiLibraries422
        | PostApiLibraries500
    >,
    TContext = unknown,
>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof postApiLibraries>>,
        TError,
        { data: BodyType<PostApiLibrariesBody> },
        TContext
    >;
    request?: SecondParameter<typeof apiInstance>;
}): UseMutationResult<
    Awaited<ReturnType<typeof postApiLibraries>>,
    TError,
    { data: BodyType<PostApiLibrariesBody> },
    TContext
> => {
    const mutationOptions = getPostApiLibrariesMutationOptions(options);

    return useMutation(mutationOptions);
};
/**
 * @summary Get library by id
 */
export const getApiLibrariesId = (
    id: string,
    options?: SecondParameter<typeof apiInstance>,
    signal?: AbortSignal,
) => {
    return apiInstance<GetApiLibrariesId200>(
        { url: `/api/libraries/${id}`, method: 'GET', signal },
        options,
    );
};

export const getGetApiLibrariesIdQueryKey = (id: string) => {
    return [`/api/libraries/${id}`] as const;
};

export const getGetApiLibrariesIdSuspenseQueryOptions = <
    TData = Awaited<ReturnType<typeof getApiLibrariesId>>,
    TError = ErrorType<
        | GetApiLibrariesId401
        | GetApiLibrariesId403
        | GetApiLibrariesId404
        | GetApiLibrariesId422
        | GetApiLibrariesId500
    >,
>(
    id: string,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApiLibrariesId>>, TError, TData>
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
) => {
    const { query: queryOptions, request: requestOptions } = options ?? {};

    const queryKey = queryOptions?.queryKey ?? getGetApiLibrariesIdQueryKey(id);

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiLibrariesId>>> = ({ signal }) =>
        getApiLibrariesId(id, requestOptions, signal);

    return { queryKey, queryFn, staleTime: 10000, ...queryOptions } as UseSuspenseQueryOptions<
        Awaited<ReturnType<typeof getApiLibrariesId>>,
        TError,
        TData
    > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetApiLibrariesIdSuspenseQueryResult = NonNullable<
    Awaited<ReturnType<typeof getApiLibrariesId>>
>;
export type GetApiLibrariesIdSuspenseQueryError = ErrorType<
    | GetApiLibrariesId401
    | GetApiLibrariesId403
    | GetApiLibrariesId404
    | GetApiLibrariesId422
    | GetApiLibrariesId500
>;

export function useGetApiLibrariesIdSuspense<
    TData = Awaited<ReturnType<typeof getApiLibrariesId>>,
    TError = ErrorType<
        | GetApiLibrariesId401
        | GetApiLibrariesId403
        | GetApiLibrariesId404
        | GetApiLibrariesId422
        | GetApiLibrariesId500
    >,
>(
    id: string,
    options: {
        query: Partial<
            UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApiLibrariesId>>, TError, TData>
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetApiLibrariesIdSuspense<
    TData = Awaited<ReturnType<typeof getApiLibrariesId>>,
    TError = ErrorType<
        | GetApiLibrariesId401
        | GetApiLibrariesId403
        | GetApiLibrariesId404
        | GetApiLibrariesId422
        | GetApiLibrariesId500
    >,
>(
    id: string,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApiLibrariesId>>, TError, TData>
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetApiLibrariesIdSuspense<
    TData = Awaited<ReturnType<typeof getApiLibrariesId>>,
    TError = ErrorType<
        | GetApiLibrariesId401
        | GetApiLibrariesId403
        | GetApiLibrariesId404
        | GetApiLibrariesId422
        | GetApiLibrariesId500
    >,
>(
    id: string,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApiLibrariesId>>, TError, TData>
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
/**
 * @summary Get library by id
 */

export function useGetApiLibrariesIdSuspense<
    TData = Awaited<ReturnType<typeof getApiLibrariesId>>,
    TError = ErrorType<
        | GetApiLibrariesId401
        | GetApiLibrariesId403
        | GetApiLibrariesId404
        | GetApiLibrariesId422
        | GetApiLibrariesId500
    >,
>(
    id: string,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApiLibrariesId>>, TError, TData>
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
    const queryOptions = getGetApiLibrariesIdSuspenseQueryOptions(id, options);

    const query = useSuspenseQuery(queryOptions) as UseSuspenseQueryResult<TData, TError> & {
        queryKey: DataTag<QueryKey, TData>;
    };

    query.queryKey = queryOptions.queryKey;

    return query;
}

/**
 * Update a library
 * @summary Update library by id
 */
export const putApiLibrariesId = (
    id: string,
    putApiLibrariesIdBody: BodyType<PutApiLibrariesIdBody>,
    options?: SecondParameter<typeof apiInstance>,
) => {
    return apiInstance<PutApiLibrariesId200>(
        {
            url: `/api/libraries/${id}`,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            data: putApiLibrariesIdBody,
        },
        options,
    );
};

export const getPutApiLibrariesIdMutationOptions = <
    TError = ErrorType<
        | PutApiLibrariesId400
        | PutApiLibrariesId401
        | PutApiLibrariesId403
        | PutApiLibrariesId404
        | PutApiLibrariesId422
        | PutApiLibrariesId500
    >,
    TContext = unknown,
>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof putApiLibrariesId>>,
        TError,
        { id: string; data: BodyType<PutApiLibrariesIdBody> },
        TContext
    >;
    request?: SecondParameter<typeof apiInstance>;
}): UseMutationOptions<
    Awaited<ReturnType<typeof putApiLibrariesId>>,
    TError,
    { id: string; data: BodyType<PutApiLibrariesIdBody> },
    TContext
> => {
    const { mutation: mutationOptions, request: requestOptions } = options ?? {};

    const mutationFn: MutationFunction<
        Awaited<ReturnType<typeof putApiLibrariesId>>,
        { id: string; data: BodyType<PutApiLibrariesIdBody> }
    > = (props) => {
        const { id, data } = props ?? {};

        return putApiLibrariesId(id, data, requestOptions);
    };

    return { mutationFn, ...mutationOptions };
};

export type PutApiLibrariesIdMutationResult = NonNullable<
    Awaited<ReturnType<typeof putApiLibrariesId>>
>;
export type PutApiLibrariesIdMutationBody = BodyType<PutApiLibrariesIdBody>;
export type PutApiLibrariesIdMutationError = ErrorType<
    | PutApiLibrariesId400
    | PutApiLibrariesId401
    | PutApiLibrariesId403
    | PutApiLibrariesId404
    | PutApiLibrariesId422
    | PutApiLibrariesId500
>;

/**
 * @summary Update library by id
 */
export const usePutApiLibrariesId = <
    TError = ErrorType<
        | PutApiLibrariesId400
        | PutApiLibrariesId401
        | PutApiLibrariesId403
        | PutApiLibrariesId404
        | PutApiLibrariesId422
        | PutApiLibrariesId500
    >,
    TContext = unknown,
>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof putApiLibrariesId>>,
        TError,
        { id: string; data: BodyType<PutApiLibrariesIdBody> },
        TContext
    >;
    request?: SecondParameter<typeof apiInstance>;
}): UseMutationResult<
    Awaited<ReturnType<typeof putApiLibrariesId>>,
    TError,
    { id: string; data: BodyType<PutApiLibrariesIdBody> },
    TContext
> => {
    const mutationOptions = getPutApiLibrariesIdMutationOptions(options);

    return useMutation(mutationOptions);
};
/**
 * @summary Delete library by id
 */
export const deleteApiLibrariesId = (id: string, options?: SecondParameter<typeof apiInstance>) => {
    return apiInstance<DeleteApiLibrariesId204>(
        { url: `/api/libraries/${id}`, method: 'DELETE' },
        options,
    );
};

export const getDeleteApiLibrariesIdMutationOptions = <
    TError = ErrorType<
        | DeleteApiLibrariesId401
        | DeleteApiLibrariesId403
        | DeleteApiLibrariesId404
        | DeleteApiLibrariesId422
        | DeleteApiLibrariesId500
    >,
    TContext = unknown,
>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof deleteApiLibrariesId>>,
        TError,
        { id: string },
        TContext
    >;
    request?: SecondParameter<typeof apiInstance>;
}): UseMutationOptions<
    Awaited<ReturnType<typeof deleteApiLibrariesId>>,
    TError,
    { id: string },
    TContext
> => {
    const { mutation: mutationOptions, request: requestOptions } = options ?? {};

    const mutationFn: MutationFunction<
        Awaited<ReturnType<typeof deleteApiLibrariesId>>,
        { id: string }
    > = (props) => {
        const { id } = props ?? {};

        return deleteApiLibrariesId(id, requestOptions);
    };

    return { mutationFn, ...mutationOptions };
};

export type DeleteApiLibrariesIdMutationResult = NonNullable<
    Awaited<ReturnType<typeof deleteApiLibrariesId>>
>;

export type DeleteApiLibrariesIdMutationError = ErrorType<
    | DeleteApiLibrariesId401
    | DeleteApiLibrariesId403
    | DeleteApiLibrariesId404
    | DeleteApiLibrariesId422
    | DeleteApiLibrariesId500
>;

/**
 * @summary Delete library by id
 */
export const useDeleteApiLibrariesId = <
    TError = ErrorType<
        | DeleteApiLibrariesId401
        | DeleteApiLibrariesId403
        | DeleteApiLibrariesId404
        | DeleteApiLibrariesId422
        | DeleteApiLibrariesId500
    >,
    TContext = unknown,
>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof deleteApiLibrariesId>>,
        TError,
        { id: string },
        TContext
    >;
    request?: SecondParameter<typeof apiInstance>;
}): UseMutationResult<
    Awaited<ReturnType<typeof deleteApiLibrariesId>>,
    TError,
    { id: string },
    TContext
> => {
    const mutationOptions = getDeleteApiLibrariesIdMutationOptions(options);

    return useMutation(mutationOptions);
};
/**
 * @summary Authenticate library by id
 */
export const postApiLibrariesIdAuth = (
    id: string,
    postApiLibrariesIdAuthBody: BodyType<PostApiLibrariesIdAuthBody>,
    options?: SecondParameter<typeof apiInstance>,
    signal?: AbortSignal,
) => {
    return apiInstance<PostApiLibrariesIdAuth200>(
        {
            url: `/api/libraries/${id}/auth`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: postApiLibrariesIdAuthBody,
            signal,
        },
        options,
    );
};

export const getPostApiLibrariesIdAuthMutationOptions = <
    TError = ErrorType<
        | PostApiLibrariesIdAuth400
        | PostApiLibrariesIdAuth401
        | PostApiLibrariesIdAuth403
        | PostApiLibrariesIdAuth404
        | PostApiLibrariesIdAuth422
        | PostApiLibrariesIdAuth500
    >,
    TContext = unknown,
>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof postApiLibrariesIdAuth>>,
        TError,
        { id: string; data: BodyType<PostApiLibrariesIdAuthBody> },
        TContext
    >;
    request?: SecondParameter<typeof apiInstance>;
}): UseMutationOptions<
    Awaited<ReturnType<typeof postApiLibrariesIdAuth>>,
    TError,
    { id: string; data: BodyType<PostApiLibrariesIdAuthBody> },
    TContext
> => {
    const { mutation: mutationOptions, request: requestOptions } = options ?? {};

    const mutationFn: MutationFunction<
        Awaited<ReturnType<typeof postApiLibrariesIdAuth>>,
        { id: string; data: BodyType<PostApiLibrariesIdAuthBody> }
    > = (props) => {
        const { id, data } = props ?? {};

        return postApiLibrariesIdAuth(id, data, requestOptions);
    };

    return { mutationFn, ...mutationOptions };
};

export type PostApiLibrariesIdAuthMutationResult = NonNullable<
    Awaited<ReturnType<typeof postApiLibrariesIdAuth>>
>;
export type PostApiLibrariesIdAuthMutationBody = BodyType<PostApiLibrariesIdAuthBody>;
export type PostApiLibrariesIdAuthMutationError = ErrorType<
    | PostApiLibrariesIdAuth400
    | PostApiLibrariesIdAuth401
    | PostApiLibrariesIdAuth403
    | PostApiLibrariesIdAuth404
    | PostApiLibrariesIdAuth422
    | PostApiLibrariesIdAuth500
>;

/**
 * @summary Authenticate library by id
 */
export const usePostApiLibrariesIdAuth = <
    TError = ErrorType<
        | PostApiLibrariesIdAuth400
        | PostApiLibrariesIdAuth401
        | PostApiLibrariesIdAuth403
        | PostApiLibrariesIdAuth404
        | PostApiLibrariesIdAuth422
        | PostApiLibrariesIdAuth500
    >,
    TContext = unknown,
>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof postApiLibrariesIdAuth>>,
        TError,
        { id: string; data: BodyType<PostApiLibrariesIdAuthBody> },
        TContext
    >;
    request?: SecondParameter<typeof apiInstance>;
}): UseMutationResult<
    Awaited<ReturnType<typeof postApiLibrariesIdAuth>>,
    TError,
    { id: string; data: BodyType<PostApiLibrariesIdAuthBody> },
    TContext
> => {
    const mutationOptions = getPostApiLibrariesIdAuthMutationOptions(options);

    return useMutation(mutationOptions);
};
