import { z } from '@hono/zod-openapi';
import {
    addPlaylistToFolderRequestSchema,
    addTracksToPlaylistRequestSchema,
    createPlaylistFolderRequestSchema,
    createPlaylistRequestSchema,
    playlistDetailResponseSchema,
    playlistDetailTrackListRequestSchema,
    playlistDetailTrackListResponseSchema,
    playlistFolderListRequestSchema,
    playlistFolderListResponseSchema,
    playlistListRequestSchema,
    playlistListResponseSchema,
    removePlaylistFromFolderRequestSchema,
    removeTracksFromPlaylistRequestSchema,
    updatePlaylistFolderRequestSchema,
    updatePlaylistRequestSchema,
} from '@/controllers/playlist/playlist-api-types.js';
import {
    CountResponseSchema,
    EmptyBodySchema,
    EmptyResponseSchema,
    schemaResponse,
} from '@/controllers/shared-api-types.js';

export const playlistApiSchema = {
    '/': {
        get: {
            request: {
                params: z.object({ libraryId: z.string() }),
                query: playlistListRequestSchema,
            },
            responses: schemaResponse(
                {
                    description: 'Get playlists',
                    schema: playlistListResponseSchema,
                    status: 200,
                },
                [401, 403, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
        post: {
            request: {
                body: {
                    content: { 'application/json': { schema: createPlaylistRequestSchema } },
                },
                params: z.object({ libraryId: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Create playlist',
                    schema: playlistDetailResponseSchema,
                    status: 201,
                },
                [401, 403, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/count': {
        get: {
            request: {
                params: z.object({ libraryId: z.string() }),
                query: playlistListRequestSchema.omit({ limit: true, offset: true }),
            },
            responses: schemaResponse(
                { description: 'Get playlists count', schema: CountResponseSchema, status: 200 },
                [401, 403, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/folders': {
        get: {
            request: {
                params: z.object({ libraryId: z.string() }),
                query: playlistFolderListRequestSchema,
            },
            responses: schemaResponse(
                {
                    description: 'Get playlist folders',
                    schema: playlistFolderListResponseSchema,
                    status: 200,
                },
                [401, 403, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
        post: {
            request: {
                body: {
                    content: { 'application/json': { schema: createPlaylistFolderRequestSchema } },
                },
                params: z.object({ libraryId: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Create playlist folder',
                    schema: EmptyResponseSchema,
                    status: 201,
                },
                [401, 403, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/folders/{folderId}': {
        delete: {
            request: {
                params: z.object({ folderId: z.string(), libraryId: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Delete playlist folder',
                    schema: EmptyBodySchema,
                    status: 204,
                },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
        get: {
            request: {
                params: z.object({ folderId: z.string(), libraryId: z.string() }),
                query: playlistFolderListRequestSchema,
            },
            responses: schemaResponse(
                {
                    description: 'Get playlist folder by id',
                    schema: playlistListResponseSchema,
                    status: 200,
                },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
        put: {
            request: {
                body: {
                    content: { 'application/json': { schema: updatePlaylistFolderRequestSchema } },
                },
                params: z.object({ folderId: z.string(), libraryId: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Update playlist folder',
                    schema: createPlaylistFolderRequestSchema,
                    status: 200,
                },
                [401, 403, 404, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/folders/{folderId}/add': {
        post: {
            request: {
                body: {
                    content: { 'application/json': { schema: addPlaylistToFolderRequestSchema } },
                },
                params: z.object({ folderId: z.string(), libraryId: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Add playlists to folder',
                    schema: EmptyBodySchema,
                    status: 204,
                },
                [401, 403, 404, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/folders/{folderId}/remove': {
        post: {
            request: {
                body: {
                    content: {
                        'application/json': { schema: removePlaylistFromFolderRequestSchema },
                    },
                },
                params: z.object({ folderId: z.string(), libraryId: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Remove playlists from folder',
                    schema: EmptyBodySchema,
                    status: 204,
                },
                [401, 403, 404, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/{id}': {
        delete: {
            request: {
                params: z.object({ id: z.string(), libraryId: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Delete playlist',
                    schema: EmptyBodySchema,
                    status: 204,
                },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
        get: {
            request: {
                params: z.object({ id: z.string(), libraryId: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Get playlist by id',
                    schema: playlistDetailResponseSchema,
                    status: 200,
                },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
        put: {
            request: {
                body: {
                    content: { 'application/json': { schema: updatePlaylistRequestSchema } },
                },
                params: z.object({ id: z.string(), libraryId: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Update playlist',
                    schema: EmptyBodySchema,
                    status: 204,
                },
                [401, 403, 404, 422, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/{id}/tracks': {
        get: {
            request: {
                params: z.object({ id: z.string(), libraryId: z.string() }),
                query: playlistDetailTrackListRequestSchema,
            },
            responses: schemaResponse(
                {
                    description: 'Get playlist tracks',
                    schema: playlistDetailTrackListResponseSchema,
                    status: 200,
                },
                [401, 403, 404, 500],
            ),
            security: [{ Bearer: [] }],
        },
    },
    '/{id}/tracks/add': {
        post: {
            request: {
                body: {
                    content: { 'application/json': { schema: addTracksToPlaylistRequestSchema } },
                },
                params: z.object({ id: z.string(), libraryId: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Add tracks to playlist',
                    schema: EmptyBodySchema,
                    status: 204,
                },
                [401, 403, 404, 422, 500],
            ),
        },
    },
    '/{id}/tracks/remove': {
        post: {
            request: {
                body: {
                    content: {
                        'application/json': { schema: removeTracksFromPlaylistRequestSchema },
                    },
                },
                params: z.object({ id: z.string(), libraryId: z.string() }),
            },
            responses: schemaResponse(
                {
                    description: 'Remove tracks from playlist',
                    schema: EmptyBodySchema,
                    status: 204,
                },
                [401, 403, 404, 422, 500],
            ),
        },
    },
};
