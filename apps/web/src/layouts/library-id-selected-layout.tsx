import { Navigate, Outlet } from 'react-router';
import { useSelectedLibraryId } from '@/features/authentication/stores/auth-store.ts';
import { APP_ROUTE } from '@/routes/app-routes.ts';

export function LibraryIdSelectedLayout() {
    const selectedLibraryId = useSelectedLibraryId();

    if (selectedLibraryId !== null) {
        return <Outlet />;
    }

    return <Navigate to={APP_ROUTE.DASHBOARD_LIBRARY_SELECT} />;
}
