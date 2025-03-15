import { useMemo } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAppDB } from '/@/api/app-db';
import { PlayerController } from '/@/controllers/player-controller';
import { PrefetchController } from '/@/controllers/prefetch-controller';
import { AppContext } from '/@/features/authentication/context/app-context';
import { ContextMenuController } from '/@/features/context-menu/context-menu-controller';
import { AudioPlayer } from '/@/features/player/components/audio-player/audio-player';
import { AppRoute } from '/@/routes/types';
import { useAuthServer } from '/@/stores/auth-store';

export function ProtectedLayout() {
    const server = useAuthServer();
    const appDB = useAppDB(server);

    const appContext = useMemo(() => ({
        appDB,
        server,
    }), [appDB, server]);

    if (!server) {
        return <Navigate to={AppRoute.INDEX} />;
    }

    return (
        <AppContext.Provider value={appContext}>
            <ContextMenuController.Root />
            <PlayerController.Root />
            <PrefetchController.Root />
            <AudioPlayer />
            <Outlet />
        </AppContext.Provider>
    );
}
