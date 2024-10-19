import { z } from '@hono/zod-openapi';
import {
    playlistDetailResponseSchema,
    playlistDetailTrackListRequestSchema,
    playlistDetailTrackListResponseSchema,
    playlistListRequestSchema,
    playlistListResponseSchema,
} from '@/controllers/playlist/playlist-api-types.js';
import { schemaResponse } from '@/controllers/shared-api-types.js';

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
    },
    '/{id}': {
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
};
