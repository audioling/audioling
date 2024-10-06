import { Navigate, Outlet, type RouteObject } from 'react-router-dom';
import { AuthenticationRoute } from '@/features/authentication/routes/authentication-route.tsx';
import { useAuthUser } from '@/features/authentication/stores/auth-store.ts';

const IsNotProtectedRoute = () => {
    const isAuthenticated = useAuthUser();
    return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
};

export const authRoutes: RouteObject[] = [
    {
        children: [
            {
                element: <AuthenticationRoute />,
                path: '/',
            },
        ],
        element: <IsNotProtectedRoute />,
    },
];
