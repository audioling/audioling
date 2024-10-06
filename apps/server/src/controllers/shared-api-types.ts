import { z } from '@hono/zod-openapi';
import { CONSTANTS } from '@/constants.js';

type SchemaMethod = {
    request: {
        body?: z.ZodTypeAny;
        params?: z.ZodTypeAny;
        query?: z.ZodTypeAny;
    };
    responses: Record<
        number,
        { content: { 'application/json': { schema: z.ZodTypeAny } }; description: string }
    >;
};

type SchemaEntry = {
    delete?: SchemaMethod;
    get?: SchemaMethod;
    post?: SchemaMethod;
    put?: SchemaMethod;
};

export type RouteSchema = Record<string, SchemaEntry>;

export const EmptyResponseSchema = z.null();

export const EmptyBodySchema = z.object({});

export const createErrorResponseSchema = (opts: { name: string; status: number }) => {
    return z
        .object({
            cause: z.string().optional().openapi({ example: 'Error cause' }),
            message: z.string().openapi({ example: 'Error message' }),
            name: z.string().openapi({ example: opts.name }),
            stack: z.string().optional().openapi({ example: 'Stack trace' }),
            status: z.number().openapi({ example: opts.status }),
        })
        .strict();
};

export const createIndividualResponseSchema = <TAttributes extends z.ZodTypeAny>(opts: {
    attributes: TAttributes;
}) => {
    return z.object({
        data: opts.attributes,
        meta: z.object({}),
    });
};

export const createPaginatedResponseSchema = <TAttributes extends z.ZodTypeAny>(opts: {
    attributes: TAttributes;
}) => {
    return z.object({
        data: opts.attributes.array(),
        meta: z.object({
            next: z.boolean().openapi({ example: true }),
            prev: z.boolean().openapi({ example: false }),
            totalRecordCount: z.number().openapi({ example: 1000 }),
        }),
    });
};

export const stringNumberSchema = z
    .string()
    .superRefine((value) => {
        const parsed = Number(value);
        return !Number.isNaN(parsed);
    })
    .openapi({ example: '100' });

export const paginationQuery = {
    limit: z
        .string()
        .optional()
        .superRefine((value, ctx) => {
            if (value === undefined) {
                return true;
            }

            const parsed = Number(value);

            if (Number.isNaN(parsed)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.invalid_type,
                    expected: 'number',
                    fatal: true,
                    message: 'Limit must be a number',
                    received: 'string',
                });
            }

            if (parsed > CONSTANTS.DEFAULT_PAGINATION_LIMIT) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_big,
                    inclusive: true,
                    maximum: CONSTANTS.DEFAULT_PAGINATION_LIMIT,
                    message: 'Limit must be less than or equal to 5000',
                    type: 'number',
                });
            }

            if (parsed < -1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_small,
                    inclusive: true,
                    message: 'Limit must be greater than or equal to -1',
                    minimum: -1,
                    type: 'number',
                });
            }

            return !Number.isNaN(parsed) && parsed >= 0;
        })
        .openapi({ example: '50' }),
    offset: z
        .string()
        .optional()
        .superRefine((value, ctx) => {
            if (value === undefined) {
                return true;
            }

            const parsed = Number(value);

            if (Number.isNaN(parsed)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.invalid_type,
                    expected: 'number',
                    fatal: true,
                    message: 'Offset must be a number',
                    received: 'string',
                });
            }

            if (parsed < 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_small,
                    inclusive: true,
                    message: 'Offset must be greater than or equal to 0',
                    minimum: 0,
                    type: 'number',
                });
            }

            return !Number.isNaN(parsed) && parsed >= 0;
        })
        .openapi({ example: '0' }),
};

export const libraryIdQuery = {
    libraryId: z.string(),
};

export const relatedAlbum = z.object({
    id: z.string(),
    imageUrl: z.string().nullable(),
    name: z.string(),
});

export const relatedArtist = z.object({
    id: z.string(),
    imageUrl: z.string().nullable(),
    name: z.string(),
});

export const relatedGenre = z.object({
    id: z.string(),
    imageUrl: z.string().nullable(),
    name: z.string(),
});

const badRequestResponse = {
    400: {
        content: {
            'application/json': {
                schema: z.object({
                    message: z.string(),
                }),
            },
        },
        description: 'Bad request',
    },
};

const unauthorizedResponse = {
    401: {
        content: {
            'application/json': {
                schema: createErrorResponseSchema({ name: 'Unauthorized', status: 401 }),
            },
        },
        description: 'Unauthorized',
    },
};

const notFoundResponse = {
    404: {
        content: {
            'application/json': {
                schema: createErrorResponseSchema({ name: 'Not found', status: 404 }),
            },
        },
        description: 'Not found',
    },
};

const permissionDeniedResponse = {
    403: {
        content: {
            'application/json': {
                schema: createErrorResponseSchema({ name: 'Permission denied', status: 403 }),
            },
        },
        description: 'Permission denied',
    },
};

const conflictResponse = {
    409: {
        content: {
            'application/json': {
                schema: createErrorResponseSchema({ name: 'Conflict', status: 409 }),
            },
        },
        description: 'Conflict',
    },
};

const validationResponse = {
    422: {
        content: {
            'application/json': {
                schema: createErrorResponseSchema({ name: 'Validation error', status: 422 }),
            },
        },
        description: 'Validation error',
    },
};

const internalServerErrorResponse = {
    500: {
        content: {
            'application/json': {
                schema: createErrorResponseSchema({ name: 'Internal server error', status: 500 }),
            },
        },
        description: 'Internal server error',
    },
};

export const schemaResponse = <T extends z.ZodTypeAny>(
    success: { description: string; schema: T; status: number },
    include: (400 | 401 | 403 | 404 | 409 | 422 | 500)[],
) => {
    const uniqueInclude = new Set(include);

    return {
        [success.status]: {
            content: { 'application/json': { schema: success.schema } },
            description: success.description,
        },
        ...(uniqueInclude.has(400) && badRequestResponse),
        ...(uniqueInclude.has(401) && unauthorizedResponse),
        ...(uniqueInclude.has(403) && permissionDeniedResponse),
        ...(uniqueInclude.has(404) && notFoundResponse),
        ...(uniqueInclude.has(409) && conflictResponse),
        ...(uniqueInclude.has(422) && validationResponse),
        ...(uniqueInclude.has(500) && internalServerErrorResponse),
    };
};
