import { Navigate, Outlet } from 'react-router-dom';
import { useSelectedLibraryId } from '@/features/authentication/stores/auth-store.ts';
import { APP_ROUTE } from '@/routes/app-routes.ts';

export const LibraryIdSelectedLayout = () => {
    const selectedLibraryId = useSelectedLibraryId();
    return selectedLibraryId !== null ? (
        <Outlet />
    ) : (
        <Navigate to={APP_ROUTE.DASHBOARD_LIBRARY_SELECT} />
    );
};
