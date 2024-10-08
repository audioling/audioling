import { Navigate, Outlet, useParams } from 'react-router-dom';
import { APP_ROUTE } from '@/routes/app-routes.ts';

export const LibraryIdSelectedLayout = () => {
    const { libraryId } = useParams<{ libraryId: string }>();
    return libraryId ? <Outlet /> : <Navigate to={APP_ROUTE.DASHBOARD_LIBRARY_SELECTOR} />;
};
