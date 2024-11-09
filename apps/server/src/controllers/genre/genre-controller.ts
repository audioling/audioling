import { createRoute } from '@hono/zod-openapi';
import { controllerHelpers } from '@/controllers/controller-helpers.js';
import type { GenreListResponse } from '@/controllers/genre/genre-api-types.js';
import { apiSchema } from '@/controllers/index.js';
import type { CountResponse } from '@/controllers/shared-api-types.js';
import type { AdapterVariables } from '@/middlewares/adapter-middleware.js';
import type { AuthVariables } from '@/middlewares/auth-middleware.js';
import { newHono } from '@/modules/hono/index.js';
import type { AppService } from '@/services/index.js';
import { genreHelpers } from './genre-helpers';

type GenreRouterContext = {
    Variables: AuthVariables & AdapterVariables;
};

// SECTION - Genre Controller
export const initGenreController = (modules: { service: AppService }) => {
    const { service } = modules;

    const controller = newHono<GenreRouterContext>();
    const defaultOpenapiTags = ['Genres'];

    // ANCHOR - GET /
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/',
            summary: 'Get all genres',
            tags: [...defaultOpenapiTags],
            ...apiSchema.genre['/'].get,
        }),
        async (c) => {
            const query = c.req.valid('query');
            const { adapter } = c.var;

            const genres = await service.genre.list(adapter, {
                folderId: query.folderId,
                limit: query.limit ? Number(query.limit) : undefined,
                offset: query.offset ? Number(query.offset) : undefined,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
            });

            const response: GenreListResponse = {
                data: genres.items.map((item) =>
                    genreHelpers.adapterToResponse(item, adapter._getLibrary().id),
                ),
                meta: {
                    next: controllerHelpers.getIsNextPage(
                        genres.offset,
                        genres.limit,
                        genres.totalRecordCount,
                    ),
                    prev: controllerHelpers.getIsPrevPage(genres.offset, genres.limit),
                    totalRecordCount: genres.totalRecordCount,
                },
            };

            return c.json(response, 200);
        },
    );

    // ANCHOR - GET /count
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/count',
            summary: 'Get genres count',
            tags: [...defaultOpenapiTags],
            ...apiSchema.genre['/count'].get,
        }),
        async (c) => {
            const { adapter } = c.var;
            const query = c.req.valid('query');
            const count = await service.genre.list(adapter, {
                folderId: query.folderId,
                limit: 1,
                offset: 0,
                searchTerm: query.searchTerm,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
            });

            const response: CountResponse = count.totalRecordCount || 0;

            return c.json(response, 200);
        },
    );

    return controller;
};

export type GenreController = ReturnType<typeof initGenreController>;
