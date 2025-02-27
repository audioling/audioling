import { Navigate, Outlet } from 'react-router';
import { AppRoute } from '/@/routes/types';
import { useAuthStore } from '/@/stores/auth-store';

export function AuthLayout() {
    const serverId = useAuthStore.use.serverId();
    const servers = useAuthStore.use.servers();

    const isServerSelected = serverId !== null;
    const isServerAuthenticated = isServerSelected && servers[serverId].user !== null;

    if (isServerSelected && isServerAuthenticated) {
        return <Navigate to={AppRoute.APP} />;
    }

    if (isServerSelected) {
        return <Navigate to={AppRoute.SIGN_IN} />;
    }

    return <Outlet />;
}
