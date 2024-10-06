import { Navigate, Outlet, type RouteObject } from 'react-router-dom';
import { useAuthUser } from '@/features/authentication/stores/auth-store.ts';
import { DashboardRoute } from '@/features/dashboard/routes/dashboard-route.tsx';
import { DashboardLayout } from '@/layouts/dashboard/dashboard-layout.tsx';

const ProtectedRoute = () => {
    const isAuthenticated = useAuthUser();
    return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" />;
};

export const dashboardRoutes: RouteObject[] = [
    {
        children: [
            {
                children: [
                    {
                        element: <DashboardRoute />,
                        path: '/dashboard',
                    },
                ],
                element: <DashboardLayout />,
            },
        ],
        element: <ProtectedRoute />,
    },
];
