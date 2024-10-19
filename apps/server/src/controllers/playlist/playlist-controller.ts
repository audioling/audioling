import { createRoute } from '@hono/zod-openapi';
import { controllerHelpers } from '@/controllers/controller-helpers.js';
import { apiSchema } from '@/controllers/index.js';
import type {
    PlaylistDetailResponse,
    PlaylistDetailTrackListResponse,
    PlaylistListResponse,
} from '@/controllers/playlist/playlist-api-types.js';
import { playlistHelpers } from '@/controllers/playlist/playlist-helpers.js';
import type { initTrackController } from '@/controllers/track/track-controller.js';
import type { AdapterVariables } from '@/middlewares/adapter-middleware.js';
import type { AuthVariables } from '@/middlewares/auth-middleware.js';
import { newHono } from '@/modules/hono/index.js';
import type { AppService } from '@/services/index.js';

type PlaylistRouterContext = {
    Variables: AuthVariables & AdapterVariables;
};

// SECTION - Playlist Controller
export const initPlaylistController = (modules: { service: AppService }) => {
    const { service } = modules;

    const controller = newHono<PlaylistRouterContext>();
    const defaultOpenapiTags = ['Playlists'];

    // ANCHOR - GET /
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/',
            summary: 'Get all playlists',
            tags: [...defaultOpenapiTags],
            ...apiSchema.playlist['/'].get,
        }),
        async (c) => {
            const query = c.req.valid('query');
            const { adapter } = c.var;

            const playlists = await service.playlist.list(adapter, {
                folderId: query.folderId,
                limit: query.limit ? Number(query.limit) : undefined,
                offset: query.offset ? Number(query.offset) : undefined,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
            });

            const response: PlaylistListResponse = {
                data: playlists.items.map((item) =>
                    playlistHelpers.adapterToResponse(
                        item,
                        adapter._getLibrary().id,
                        item.thumbHash,
                    ),
                ),
                meta: {
                    next: controllerHelpers.getIsNextPage(
                        playlists.offset,
                        playlists.limit,
                        playlists.totalRecordCount,
                    ),
                    prev: controllerHelpers.getIsPrevPage(playlists.offset, playlists.limit),
                    totalRecordCount: playlists.totalRecordCount,
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
            summary: 'Get playlist by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.playlist['/{id}'].get,
        }),
        async (c) => {
            const params = c.req.param();
            const { adapter } = c.var;

            const playlist = await service.playlist.detail(adapter, {
                id: params.id,
            });

            const response: PlaylistDetailResponse = {
                data: playlistHelpers.adapterToResponse(
                    playlist,
                    adapter._getLibrary().id,
                    playlist.thumbHash,
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
            summary: 'Get playlist tracks',
            tags: [...defaultOpenapiTags],
            ...apiSchema.playlist['/{id}/tracks'].get,
        }),
        async (c) => {
            const params = c.req.param();
            const query = c.req.valid('query');
            const { adapter } = c.var;

            const playlist = await service.playlist.detailTrackList(adapter, {
                id: params.id,
                limit: query.limit ? Number(query.limit) : undefined,
                offset: query.offset ? Number(query.offset) : undefined,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
            });

            const response: PlaylistDetailTrackListResponse = {
                data: playlist.items.map((item) =>
                    playlistHelpers.adapterTrackToResponse(
                        item,
                        adapter._getLibrary().id,
                        item.thumbHash,
                    ),
                ),
                meta: {
                    next: controllerHelpers.getIsNextPage(
                        playlist.offset,
                        playlist.limit,
                        playlist.totalRecordCount,
                    ),
                    prev: controllerHelpers.getIsPrevPage(playlist.offset, playlist.limit),
                    totalRecordCount: playlist.totalRecordCount,
                },
            };

            return c.json(response, 200);
        },
    );

    return controller;
};

export type MediaFileController = ReturnType<typeof initTrackController>;
