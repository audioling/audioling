import type { AdapterAPI } from '@repo/shared-types/adapter-types';
import { localize } from '@repo/localization';
import { ServerType } from '@repo/shared-types/app-types';
import { adapter as OSAdapter } from './opensubsonic/opensubsonic-api.js';

export function adapterAPI(serverType: ServerType): AdapterAPI {
    const adapters = {
        [ServerType.OPENSUBSONIC]: OSAdapter,
        [ServerType.JELLYFIN]: {},
        [ServerType.NAVIDROME]: {},
    } as Record<ServerType, AdapterAPI>;

    const adapter = adapters[serverType];

    if (!adapter) {
        throw new Error(localize.t('errors.adapterNotFound'));
    }

    return adapter;
}
