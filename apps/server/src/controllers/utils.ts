/* eslint-disable @typescript-eslint/no-explicit-any */
const parseOrderByQuery = (query: string | string[] | undefined) => {
    if (!query) return undefined;

    if (typeof query === 'string') {
        const decodedQuery = decodeURI(query);
        const [column, order] = decodedQuery.split(':');
        return [{ [column]: order || 'asc' }];
    }

    return query.map((q) => {
        const decodedQuery = decodeURI(q);
        const [column, order] = decodedQuery.split(':');
        return { [column]: order || 'asc' };
    });
};

const parseLimitQuery = (query?: string) => {
    if (!query) return 50;
    const parsed = Number(query);
    return !Number.isNaN(parsed) && parsed >= 0 ? parsed : 50;
};

const parseOffsetQuery = (query?: string) => {
    if (!query) return 0;
    const parsed = Number(query);
    return !Number.isNaN(parsed) && parsed >= 0 ? parsed : 0;
};

const parseAdvancedFilterQuery = (query: string): Record<string, unknown> => {
    // const decodedQuery = decodeURI(query);
    return JSON.parse(query);
};

const parsePaginationUrls = (args: {
    limit: number;
    offset: number;
    totalRecordCount: number;
    url: string;
}) => {
    const { limit, offset, url, totalRecordCount } = args;

    const apiRoute = url.split('/api')[1];

    const hasNext = totalRecordCount > offset + limit;

    const next = hasNext ? apiRoute.replace(/offset=\d+/, `offset=${offset + limit}`) : null;
    const prev =
        offset === 0
            ? null
            : apiRoute.replace(/offset=\d+/, `offset=${Math.max(0, offset - limit)}`);

    return { next, prev };
};

export type InferResponseType<
    T extends {
        responses: { [key: number]: { content: { 'application/json': { schema: any } } } };
    },
    TResultCode extends number,
> = T['responses'][TResultCode]['content']['application/json']['schema'];

export const controllerUtils = {
    parseAdvancedFilterQuery,
    parseLimitQuery,
    parseOffsetQuery,
    parseOrderByQuery,
    parsePaginationUrls,
};
