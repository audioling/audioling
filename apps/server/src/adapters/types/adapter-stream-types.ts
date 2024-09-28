import type { QueryRequest } from '@/adapters/types/shared-types.js';

export type AdapterStreamQuery = {
    bitRate?: number;
    format?: string;
    id: string;
};

export type AdapterStreamRequest = QueryRequest<AdapterStreamQuery>;

export type AdapterStreamResponse = string;
