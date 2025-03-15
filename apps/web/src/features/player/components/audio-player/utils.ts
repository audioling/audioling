import type { AuthServer } from '@repo/shared-types/app-types';
import { adapterAPI } from '@repo/adapter-api';
import { useAuthStore } from '/@/stores/auth-store';

export function getStreamUrl(id: string, server: AuthServer | string) {
    if (typeof server === 'string') {
        const servers = useAuthStore.getState().servers;
        const selectedServer = servers[server];

        if (!selectedServer) {
            throw new Error('Server not found');
        }

        return adapterAPI(selectedServer.type)._getStreamUrl({ id }, selectedServer);
    }

    return adapterAPI(server.type)._getStreamUrl({ id }, server);
}
