import type { AdapterAPI, AdapterSetFavoriteRequest, ExtractAdapterResponse } from '@repo/shared-types/adapter-types';
import type { AuthServer } from '@repo/shared-types/app-types';
import { adapterAPI } from '@repo/adapter-api';

export type SetFavoriteResponse = ExtractAdapterResponse<AdapterAPI['meta']['setFavorite']>;

export async function setFavorite(server: AuthServer, params: AdapterSetFavoriteRequest) {
    const adapter = adapterAPI(server.type);
    const result = await adapter.meta.setFavorite(params, server);

    if (result[0]) {
        throw new Error(result[0].message);
    }

    return result[1];
}

export interface SetFavoriteRequest {
    ids: string[];
    serverId: string;
}
