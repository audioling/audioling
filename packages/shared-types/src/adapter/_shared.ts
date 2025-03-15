export interface PaginatedResponse<T> {
    items: T[];
    limit: number;
    offset: number;
}

export interface ApiClientArgs {
    signal?: AbortSignal;
    url?: string;
}

export interface BaseEndpointArgs {
    apiClient: ApiClientArgs;
}

export interface QueryRequest<TQuery> {
    query: TQuery;
}

export interface QueryMutation<TQuery, TBody = null> {
    body: TBody;
    query: TQuery;
}
