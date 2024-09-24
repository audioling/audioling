export interface PaginatedResponse<T> {
    items: T[];
    startIndex: number;
    totalRecordCount: number | null;
}

export type ApiClientArgs = {
    signal?: AbortSignal;
    url?: string;
};

export type BaseEndpointArgs = {
    apiClient: ApiClientArgs;
};

export type QueryRequest<TQuery> = {
    query: TQuery;
};

export type QueryMutation<TQuery, TBody = null> = {
    body: TBody;
    query: TQuery;
};
