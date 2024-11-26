import { createRoute } from '@hono/zod-openapi';
import type {
    AlbumDetailResponse,
    AlbumListResponse,
} from '@/controllers/album/album-api-types.js';
import { controllerHelpers } from '@/controllers/controller-helpers.js';
import { apiSchema } from '@/controllers/index.js';
import type { CountResponse } from '@/controllers/shared-api-types.js';
import type { TrackListResponse } from '@/controllers/track/track-api-types.js';
import { trackHelpers } from '@/controllers/track/track-helpers.js';
import type { AdapterVariables } from '@/middlewares/adapter-middleware.js';
import type { AuthVariables } from '@/middlewares/auth-middleware.js';
import { newHono } from '@/modules/hono/index.js';
import type { AppService } from '@/services/index.js';
import { albumHelpers } from './album-helpers';

type AlbumRouterContext = {
    Variables: AuthVariables & AdapterVariables;
};

// SECTION - Album Controller
export const initAlbumController = (modules: { service: AppService }) => {
    const { service } = modules;

    const controller = newHono<AlbumRouterContext>();
    const defaultOpenapiTags = ['Albums'];

    // ANCHOR - GET /
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/',
            summary: 'Get all albums',
            tags: [...defaultOpenapiTags],
            ...apiSchema.album['/'].get,
        }),
        async (c) => {
            const query = c.req.valid('query');
            const { adapter, authToken } = c.var;

            const albums = await service.album.list(adapter, {
                folderId: query.folderId,
                limit: query.limit ? Number(query.limit) : undefined,
                offset: query.offset ? Number(query.offset) : undefined,
                searchTerm: query.searchTerm,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
            });

            const response: AlbumListResponse = {
                data: albums.items.map((item) =>
                    albumHelpers.adapterToResponse(
                        item,
                        adapter._getLibrary().id,
                        item.thumbHash,
                        authToken,
                    ),
                ),
                meta: {
                    next: controllerHelpers.getIsNextPage(
                        albums.offset,
                        albums.limit,
                        albums.totalRecordCount,
                    ),
                    prev: controllerHelpers.getIsPrevPage(albums.offset, albums.limit),
                    totalRecordCount: albums.totalRecordCount || 0,
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
            summary: 'Get all albums count',
            tags: [...defaultOpenapiTags],
            ...apiSchema.album['/count'].get,
        }),
        async (c) => {
            const query = c.req.valid('query');
            const { adapter } = c.var;

            const albums = await service.album.list(adapter, {
                folderId: query.folderId,
                limit: 1,
                offset: 0,
                searchTerm: query.searchTerm,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
            });

            const response: CountResponse = albums.totalRecordCount || 0;

            return c.json(response, 200);
        },
    );

    // ANCHOR - GET /{id}
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/{id}',
            summary: 'Get album by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.album['/{id}'].get,
        }),
        async (c) => {
            const { id } = c.req.param();
            const { adapter, authToken } = c.var;

            const album = await service.album.detail(adapter, { id });

            const response: AlbumDetailResponse = {
                data: albumHelpers.adapterToResponse(
                    album,
                    adapter._getLibrary().id,
                    album.thumbHash,
                    authToken,
                ),
                meta: {},
            };

            return c.json(response, 200);
        },
    );

    // ANCHOR - GET /{id}/tracks
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/{id}/tracks',
            summary: 'Get album tracks by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.album['/{id}/tracks'].get,
        }),
        async (c) => {
            const query = c.req.valid('query');
            const { id } = c.req.param();
            const { adapter, authToken } = c.var;

            const tracks = await service.album.detailTrackList(adapter, {
                id,
                limit: query.limit ? Number(query.limit) : undefined,
                offset: query.offset ? Number(query.offset) : undefined,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
            });

            const response: TrackListResponse = {
                data: tracks.items.map((item) =>
                    trackHelpers.adapterToResponse(
                        item,
                        adapter._getLibrary().id,
                        item.thumbHash,
                        authToken,
                    ),
                ),
                meta: {
                    next: controllerHelpers.getIsNextPage(
                        tracks.offset,
                        tracks.limit,
                        tracks.totalRecordCount,
                    ),
                    prev: controllerHelpers.getIsPrevPage(tracks.offset, tracks.limit),
                    totalRecordCount: tracks.totalRecordCount,
                },
            };

            return c.json(response, 200);
        },
    );

    // ANCHOR - POST /{id}/favorite
    controller.openapi(
        createRoute({
            method: 'post',
            path: '/{id}/favorite',
            summary: 'Add album favorite by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.album['/{id}/favorite'].post,
        }),
        async (c) => {
            const { id } = c.req.param();
            const { adapter } = c.var;

            await service.album.unfavoriteById(adapter, { id });

            return c.json(null, 204);
        },
    );

    // ANCHOR - DELETE /{id}/favorite
    controller.openapi(
        createRoute({
            method: 'delete',
            path: '/{id}/favorite',
            summary: 'Remove album favorite by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.album['/{id}/favorite'].delete,
        }),
        async (c) => {
            const { id } = c.req.param();
            const { adapter } = c.var;

            await service.album.favoriteById(adapter, { id });

            return c.json(null, 204);
        },
    );

    return controller;
};

export type AlbumController = ReturnType<typeof initAlbumController>;
