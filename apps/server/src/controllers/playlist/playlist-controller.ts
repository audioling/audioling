import { createRoute } from '@hono/zod-openapi';
import { controllerHelpers } from '@/controllers/controller-helpers.js';
import { apiSchema } from '@/controllers/index.js';
import type {
    PlaylistDetailResponse,
    PlaylistDetailTrackListResponse,
    PlaylistFolderListResponse,
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
            const { adapter, user } = c.var;

            const playlists = await service.playlist.list(adapter, {
                folderId: query.folderId,
                limit: query.limit ? Number(query.limit) : undefined,
                offset: query.offset ? Number(query.offset) : undefined,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
                userId: user.id,
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

    // ANCHOR - POST /
    controller.openapi(
        createRoute({
            method: 'post',
            path: '/',
            summary: 'Create playlist',
            tags: [...defaultOpenapiTags],
            ...apiSchema.playlist['/'].post,
        }),
        async (c) => {
            const body = c.req.valid('json');
            const { adapter } = c.var;

            await service.playlist.add(adapter, {
                values: body,
            });

            return c.json(null, 204);
        },
    );

    // ANCHOR - GET /folders
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/folders',
            summary: 'Get all playlist folders',
            tags: [...defaultOpenapiTags],
            ...apiSchema.playlist['/folders'].get,
        }),
        async (c) => {
            const query = c.req.valid('query');
            const { user } = c.var;

            const folders = await service.playlist.folderList({
                limit: query.limit ? Number(query.limit) : undefined,
                offset: query.offset ? Number(query.offset) : undefined,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
                userId: user.id,
            });

            const response: PlaylistFolderListResponse = {
                data: folders,
                meta: {
                    next: false,
                    prev: false,
                    totalRecordCount: folders.length,
                },
            };

            return c.json(response, 200);
        },
    );

    // ANCHOR - POST /folders
    controller.openapi(
        createRoute({
            method: 'post',
            path: '/folders',
            summary: 'Create playlist folder',
            tags: [...defaultOpenapiTags],
            ...apiSchema.playlist['/folders'].post,
        }),
        async (c) => {
            const body = c.req.valid('json');
            const { user } = c.var;

            await service.playlist.addFolder({
                name: body.name,
                parentId: body.parentId ?? null,
                userId: user.id,
            });

            return c.json(null, 201);
        },
    );

    // ANCHOR - GET /folders/{folderId}
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/folders/{folderId}',
            summary: 'Get playlist folder by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.playlist['/folders/{folderId}'].get,
        }),
        async (c) => {
            const params = c.req.param();
            const query = c.req.valid('query');
            const { user } = c.var;

            const folder = await service.playlist.folderList({
                limit: query.limit ? Number(query.limit) : undefined,
                offset: query.offset ? Number(query.offset) : undefined,
                playlistFolderId: params.folderId,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
                userId: user.id,
            });

            const response: PlaylistFolderListResponse = {
                data: folder,
                meta: {
                    next: false,
                    prev: false,
                    totalRecordCount: folder.length,
                },
            };

            return c.json(response, 200);
        },
    );

    // ANCHOR - PUT /folders/{folderId}
    controller.openapi(
        createRoute({
            method: 'put',
            path: '/folders/{folderId}',
            summary: 'Update playlist folder',
            tags: [...defaultOpenapiTags],
            ...apiSchema.playlist['/folders/{folderId}'].put,
        }),
        async (c) => {
            const params = c.req.param();
            const body = c.req.valid('json');
            const { user } = c.var;

            await service.playlist.updateFolder({
                folderId: params.folderId,
                userId: user.id,
                values: body,
            });

            return c.json(null, 204);
        },
    );

    // ANCHOR - DELETE /folders/{folderId}
    controller.openapi(
        createRoute({
            method: 'delete',
            path: '/folders/{folderId}',
            summary: 'Delete playlist folder',
            tags: [...defaultOpenapiTags],
            ...apiSchema.playlist['/folders/{folderId}'].delete,
        }),
        async (c) => {
            const params = c.req.param();
            const { user } = c.var;

            await service.playlist.removeFolder({
                folderId: params.folderId,
                userId: user.id,
            });

            return c.json(null, 204);
        },
    );

    // ANCHOR - POST /folders/{folderId}/add
    controller.openapi(
        createRoute({
            method: 'post',
            path: '/folders/{folderId}/add',
            summary: 'Add playlists to folder',
            tags: [...defaultOpenapiTags],
            ...apiSchema.playlist['/folders/{folderId}/add'].post,
        }),
        async (c) => {
            const params = c.req.param();
            const body = c.req.valid('json');
            const { user } = c.var;

            await service.playlist.addPlaylistToFolder({
                folderId: params.folderId,
                playlistIds: body.playlistIds,
                userId: user.id,
            });

            return c.json(null, 204);
        },
    );

    // ANCHOR - POST /folders/{folderId}/remove
    controller.openapi(
        createRoute({
            method: 'post',
            path: '/folders/{folderId}/remove',
            summary: 'Remove playlists from folder',
            tags: [...defaultOpenapiTags],
            ...apiSchema.playlist['/folders/{folderId}/remove'].post,
        }),
        async (c) => {
            const params = c.req.param();
            const body = c.req.valid('json');
            const { user } = c.var;

            await service.playlist.removePlaylistsFromFolder({
                folderId: params.folderId,
                playlistIds: body.playlistIds,
                userId: user.id,
            });

            return c.json(null, 204);
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

    // ANCHOR - PUT /{id}
    controller.openapi(
        createRoute({
            method: 'put',
            path: '/{id}',
            summary: 'Update playlist',
            tags: [...defaultOpenapiTags],
            ...apiSchema.playlist['/{id}'].put,
        }),
        async (c) => {
            const params = c.req.param();
            const body = c.req.valid('json');
            const { adapter } = c.var;

            await service.playlist.update(adapter, {
                id: params.id,
                values: body,
            });

            return c.json(null, 204);
        },
    );

    // ANCHOR - DELETE /{id}
    controller.openapi(
        createRoute({
            method: 'delete',
            path: '/{id}',
            summary: 'Delete playlist',
            tags: [...defaultOpenapiTags],
            ...apiSchema.playlist['/{id}'].delete,
        }),
        async (c) => {
            const params = c.req.param();
            const { adapter } = c.var;

            await service.playlist.remove(adapter, { id: params.id });

            return c.json(null, 204);
        },
    );

    return controller;
};

export type MediaFileController = ReturnType<typeof initTrackController>;
