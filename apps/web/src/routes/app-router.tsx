import { createBrowserRouter, Outlet } from 'react-router-dom';
import { GlobalErrorBoundary } from '@/layouts/global-error-boundary.tsx';
import { authRoutes } from '@/routes/auth-routes.tsx';
import { dashboardRoutes } from '@/routes/dashboard/dashboard-routes.tsx';

export const appRouter = createBrowserRouter([
    {
        children: [...authRoutes, ...dashboardRoutes],
        element: <RootRoute />,
        errorElement: <GlobalErrorBoundary />,
        path: '/',
    },
]);

function RootRoute() {
    return <Outlet />;
}
