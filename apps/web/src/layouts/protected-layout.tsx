import { Navigate, Outlet } from 'react-router';
import { AppRoute } from '/@/routes/types';
import { useAuthStore } from '/@/stores/auth-store';

export function ProtectedLayout() {
    const isServerActive = useAuthStore.use.serverId();

    if (!isServerActive) {
        return <Navigate to={AppRoute.INDEX} />;
    }

    return <Outlet />;
}
