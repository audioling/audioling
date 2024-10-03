import { createRoute } from '@hono/zod-openapi';
import type { AlbumListResponse } from '@/controllers/album/album-api-types.js';
import { albumHelpers } from '@/controllers/album/album-helpers.js';
import type {
    AlbumArtistDetailResponse,
    AlbumArtistListResponse,
} from '@/controllers/album-artist/album-artist-api-types.js';
import { albumArtistHelpers } from '@/controllers/album-artist/album-artist-helpers.js';
import { controllerHelpers } from '@/controllers/controller-helpers.js';
import { apiSchema } from '@/controllers/index.js';
import type { TrackListResponse } from '@/controllers/track/track-api-types.js';
import { trackHelpers } from '@/controllers/track/track-helpers.js';
import type { AdapterVariables } from '@/middlewares/adapter-middleware.js';
import type { AuthVariables } from '@/middlewares/auth-middleware.js';
import { newHono } from '@/modules/hono/index.js';
import type { AppService } from '@/services/index.js';

type AlbumRouterContext = {
    Variables: AuthVariables & AdapterVariables;
};

// SECTION - Album Controller
export const initAlbumArtistController = (modules: { service: AppService }) => {
    const { service } = modules;

    const controller = newHono<AlbumRouterContext>();
    const defaultOpenapiTags = ['Album Artists'];

    // ANCHOR - GET /
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/',
            summary: 'Get all album artists',
            tags: [...defaultOpenapiTags],
            ...apiSchema.albumArtist['/'].get,
        }),
        async (c) => {
            const query = c.req.valid('query');
            const { adapter } = c.var;

            const artists = await service.albumArtist.list(adapter, {
                folderId: query.folderId,
                limit: query.limit ? Number(query.limit) : undefined,
                offset: query.offset ? Number(query.offset) : undefined,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
            });

            const response: AlbumArtistListResponse = {
                data: artists.items.map((item) =>
                    albumArtistHelpers.adapterToResponse(item, adapter._getLibrary().id),
                ),
                meta: {
                    next: controllerHelpers.getIsNextPage(
                        artists.offset,
                        artists.limit,
                        artists.totalRecordCount,
                    ),
                    prev: controllerHelpers.getIsPrevPage(artists.offset, artists.limit),
                    totalRecordCount: artists.totalRecordCount || 0,
                },
            };

            return c.json(response, 200);
        },
    );

    // ANCHOR - GET /{id}
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/{id}',
            summary: 'Get album artist by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.albumArtist['/{id}'].get,
        }),
        async (c) => {
            const { id } = c.req.param();
            const { adapter } = c.var;

            const artist = await service.albumArtist.detail(adapter, { id });

            const response: AlbumArtistDetailResponse = {
                data: albumArtistHelpers.adapterToResponse(artist, adapter._getLibrary().id),
                meta: {},
            };

            return c.json(response, 200);
        },
    );

    // ANCHOR - GET /{id}/albums
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/{id}/albums',
            summary: 'Get album artist albums by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.albumArtist['/{id}/albums'].get,
        }),
        async (c) => {
            const query = c.req.valid('query');
            const { id } = c.req.param();
            const { adapter } = c.var;

            const albums = await service.albumArtist.detailAlbumList(adapter, {
                id,
                limit: query.limit ? Number(query.limit) : undefined,
                offset: query.offset ? Number(query.offset) : undefined,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
            });

            const response: AlbumListResponse = {
                data: albums.items.map((item) =>
                    albumHelpers.adapterToResponse(item, adapter._getLibrary().id),
                ),
                meta: {
                    next: controllerHelpers.getIsNextPage(
                        albums.offset,
                        albums.limit,
                        albums.totalRecordCount,
                    ),
                    prev: controllerHelpers.getIsPrevPage(albums.offset, albums.limit),
                    totalRecordCount: albums.totalRecordCount,
                },
            };

            return c.json(response, 200);
        },
    );

    // ANCHOR - GET /{id}/tracks
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/{id}/tracks',
            summary: 'Get album artist tracks by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.albumArtist['/{id}/tracks'].get,
        }),
        async (c) => {
            const query = c.req.valid('query');
            const { id } = c.req.param();
            const { adapter } = c.var;

            const tracks = await service.albumArtist.detailTrackList(adapter, {
                id,
                limit: query.limit ? Number(query.limit) : undefined,
                offset: query.offset ? Number(query.offset) : undefined,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
            });

            const response: TrackListResponse = {
                data: tracks.items.map((item) =>
                    trackHelpers.adapterToResponse(item, adapter._getLibrary().id),
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
            summary: 'Add album artist favorite by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.albumArtist['/{id}/favorite'].post,
        }),
        async (c) => {
            const { id } = c.req.param();
            const { adapter } = c.var;

            await service.albumArtist.unfavoriteById(adapter, { id });

            return c.json(null, 204);
        },
    );

    // ANCHOR - DELETE /{id}/favorite
    controller.openapi(
        createRoute({
            method: 'delete',
            path: '/{id}/favorite',
            summary: 'Remove album artist favorite by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.albumArtist['/{id}/favorite'].delete,
        }),
        async (c) => {
            const { id } = c.req.param();
            const { adapter } = c.var;

            await service.albumArtist.unfavoriteById(adapter, { id });

            return c.json(null, 204);
        },
    );

    return controller;
};

export type AlbumArtistController = ReturnType<typeof initAlbumArtistController>;
