import type { QueryRequest } from '@/adapters/types/shared-types.js';

export type StreamQuery = {
    bitRate?: number;
    format?: string;
    id: string;
};

export type StreamRequest = QueryRequest<StreamQuery>;

export type StreamResponse = string;
