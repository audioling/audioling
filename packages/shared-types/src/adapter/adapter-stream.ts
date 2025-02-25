import type { QueryRequest } from './_shared.js';

export interface AdapterStreamQuery {
    bitRate?: number;
    format?: string;
    id: string;
}

export type AdapterStreamRequest = QueryRequest<AdapterStreamQuery>;

export type AdapterStreamResponse = string;
