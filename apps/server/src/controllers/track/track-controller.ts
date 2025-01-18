import { createRoute } from '@hono/zod-openapi';
import { controllerHelpers } from '@/controllers/controller-helpers.js';
import { apiSchema } from '@/controllers/index.js';
import type { CountResponse } from '@/controllers/shared-api-types.js';
import type {
    TrackDetailResponse,
    TrackListResponse,
    TrackQuery,
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
                    trackHelpers.adapterToResponse(item, adapter._getLibrary().id, authToken),
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

            const totalRecordCount = await service.track.listCount(adapter, {
                folderId: query.folderId,
                searchTerm: query.searchTerm,
                sortBy: query.sortBy,
            });

            const response: CountResponse = totalRecordCount;

            return c.json(response, 200);
        },
    );

    // ANCHOR - POST /count/invalidate
    controller.openapi(
        createRoute({
            method: 'post',
            path: '/count/invalidate',
            summary: 'Invalidate track count',
            tags: [...defaultOpenapiTags],
            ...apiSchema.track['/count/invalidate'].post,
        }),
        async (c) => {
            const { adapter } = c.var;
            await service.track.invalidateCounts(adapter);
            return c.body(null, 204);
        },
    );

    // ANCHOR - POST /favorite
    controller.openapi(
        createRoute({
            method: 'post',
            path: '/favorite',
            summary: 'Add track favorites by ids',
            tags: [...defaultOpenapiTags],
            ...apiSchema.track['/favorite'].post,
        }),
        async (c) => {
            const { adapter } = c.var;
            const body = c.req.valid('json');

            for (const id of body.ids) {
                await service.track.favoriteById(adapter, { id });
            }

            return c.body(null, 204);
        },
    );

    // ANCHOR - POST /unfavorite
    controller.openapi(
        createRoute({
            method: 'post',
            path: '/unfavorite',
            summary: 'Remove track favorites by ids',
            tags: [...defaultOpenapiTags],
            ...apiSchema.track['/unfavorite'].post,
        }),
        async (c) => {
            const { adapter } = c.var;
            const body = c.req.valid('json');

            for (const id of body.ids) {
                await service.track.unfavoriteById(adapter, { id });
            }

            return c.body(null, 204);
        },
    );

    // ANCHOR - GET /query
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/query',
            summary: 'Get tracks query',
            tags: [...defaultOpenapiTags],
            ...apiSchema.track['/query'].get,
        }),
        async (c) => {
            const { adapter, authToken } = c.var;
            const query = c.req.valid('query');

            const trackQuery = decodeURIComponent(query.query);
            const queryObject = JSON.parse(trackQuery) as TrackQuery;

            const result = await service.track.queryIndex(adapter, {
                limit: query.limit ? Number(query.limit) : undefined,
                offset: query.offset ? Number(query.offset) : undefined,
                query: queryObject,
            });

            const response: TrackListResponse = {
                data: result.items.map((item) =>
                    trackHelpers.adapterToResponse(item, adapter._getLibrary().id, authToken),
                ),
                meta: {
                    next: controllerHelpers.getIsNextPage(
                        result.offset,
                        result.limit,
                        result.totalRecordCount,
                    ),
                    prev: controllerHelpers.getIsPrevPage(result.offset, result.limit),
                    totalRecordCount: result.totalRecordCount,
                },
            };

            return c.json(response, 200);
        },
    );

    // ANCHOR - GET /query/status
    controller.openapi(
        createRoute({
            method: 'get',
            path: '/query/status',
            summary: 'Get track query status',
            tags: [...defaultOpenapiTags],
            ...apiSchema.track['/query/status'].get,
        }),
        async (c) => {
            const { adapter } = c.var;
            const status = await service.track.queryStatus(adapter);
            return c.json(status, 200);
        },
    );

    // ANCHOR - POST /query/index
    controller.openapi(
        createRoute({
            method: 'post',
            path: '/query/index',
            summary: 'Start track list indexing',
            tags: [...defaultOpenapiTags],
            ...apiSchema.track['/query/index'].post,
        }),
        async (c) => {
            const { adapter } = c.var;
            await service.track.buildQueryIndex(adapter);
            return c.body(null, 204);
        },
    );

    // ANCHOR - DELETE /query/index
    controller.openapi(
        createRoute({
            method: 'delete',
            path: '/query/index',
            summary: 'Abort track list indexing',
            tags: [...defaultOpenapiTags],
            ...apiSchema.track['/query/index'].delete,
        }),
        async (c) => {
            await service.track.abortIndexJob();
            return c.body(null, 204);
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
                data: trackHelpers.adapterToResponse(track, adapter._getLibrary().id, authToken),
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

    return controller;
};

export type TrackController = ReturnType<typeof initTrackController>;
