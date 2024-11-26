import { createRoute } from '@hono/zod-openapi';
import { controllerHelpers } from '@/controllers/controller-helpers.js';
import { apiSchema } from '@/controllers/index.js';
import type { CountResponse } from '@/controllers/shared-api-types.js';
import type {
    TrackDetailResponse,
    TrackListResponse,
} from '@/controllers/track/track-api-types.js';
import { trackHelpers } from '@/controllers/track/track-helpers.js';
import type { AdapterVariables } from '@/middlewares/adapter-middleware.js';
import type { AuthVariables } from '@/middlewares/auth-middleware.js';
import { newHono } from '@/modules/hono/index.js';
import type { AppService } from '@/services/index.js';

type TrackRouterContext = {
    Variables: AuthVariables & AdapterVariables;
};

// SECTION - Track Controller
export const initTrackController = (modules: { service: AppService }) => {
    const { service } = modules;

    const controller = newHono<TrackRouterContext>();
    const defaultOpenapiTags = ['Tracks'];

    // ANCHOR - GET /
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/',
            summary: 'Get all tracks',
            tags: [...defaultOpenapiTags],
            ...apiSchema.track['/'].get,
        }),
        async (c) => {
            const query = c.req.valid('query');
            const { adapter, authToken } = c.var;

            const tracks = await service.track.list(adapter, {
                folderId: query.folderId,
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

    // ANCHOR - GET /count
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/count',
            summary: 'Get all tracks count',
            tags: [...defaultOpenapiTags],
            ...apiSchema.track['/count'].get,
        }),
        async (c) => {
            const query = c.req.valid('query');
            const { adapter } = c.var;

            const tracks = await service.track.list(adapter, {
                folderId: query.folderId,
                limit: 1,
                offset: 0,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
            });

            const response: CountResponse = tracks.totalRecordCount || 0;

            return c.json(response, 200);
        },
    );

    // ANCHOR - GET /{id}
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/{id}',
            summary: 'Get track by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.album['/{id}'].get,
        }),
        async (c) => {
            const params = c.req.param();
            const { adapter, authToken } = c.var;

            const track = await service.track.detail(adapter, {
                id: params.id,
            });

            const response: TrackDetailResponse = {
                data: trackHelpers.adapterToResponse(
                    track,
                    adapter._getLibrary().id,
                    track.thumbHash,
                    authToken,
                ),
                meta: {},
            };

            return c.json(response, 200);
        },
    );

    // ANCHOR - GET /{id}/stream
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/{id}/stream',
            summary: 'Get track stream by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.track['/{id}/stream'].get,
        }),
        async (c) => {
            const { id } = c.req.param();
            const { adapter } = c.var;

            const streamUrl = await service.track.getStreamUrl(adapter, { id });

            const response = await fetch(streamUrl, {
                headers: {
                    ...(c.req.header('range') && {
                        range: c.req.header('range'),
                    }),
                },
            });

            const headers = new Headers(response.headers);
            return new Response(response.body, {
                headers,
                status: response.status,
            });
        },
    );

    // ANCHOR - POST /{id}/favorite
    controller.openapi(
        createRoute({
            method: 'post',
            path: '/{id}/favorite',
            summary: 'Add track favorite by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.track['/{id}/favorite'].post,
        }),
        async (c) => {
            const { id } = c.req.param();
            const { adapter } = c.var;

            await service.track.unfavoriteById(adapter, { id });

            return c.json(null, 204);
        },
    );

    // ANCHOR - DELETE /{id}/favorite
    controller.openapi(
        createRoute({
            method: 'delete',
            path: '/{id}/favorite',
            summary: 'Remove track favorite by id',
            tags: [...defaultOpenapiTags],
            ...apiSchema.track['/{id}/favorite'].delete,
        }),
        async (c) => {
            const { id } = c.req.param();
            const { adapter } = c.var;

            await service.track.unfavoriteById(adapter, { id });

            return c.json(null, 204);
        },
    );

    return controller;
};

export type MediaFileController = ReturnType<typeof initTrackController>;
