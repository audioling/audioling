import type { AppDB } from '/@/api/app-db';
import type { AuthServer } from '@repo/shared-types/app-types';
import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router';
import { AppRoute } from '/@/routes/types';
import { useAuthStore } from '/@/stores/auth-store';

export const AppContext = createContext<{
    appDB: AppDB | null;
    server: AuthServer | null;
}>({
    appDB: null,
    server: null,
});

export function useAppContext(): { appDB: AppDB; server: AuthServer } {
    const { appDB, server } = useContext(AppContext);
    const signOut = useAuthStore.use.signOut();
    const navigate = useNavigate();

    if (!server) {
        signOut(null);
        throw navigate(AppRoute.INDEX);
    }

    return { appDB: appDB as AppDB, server };
}

export function useAppFeatures() {
    const { server } = useAppContext();
    return server?.features;
}
