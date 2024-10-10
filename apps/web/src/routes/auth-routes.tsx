import { Navigate, Outlet, type RouteObject } from 'react-router-dom';
import { RegistrationRoute } from '@/features/authentication/registration/registration-route.tsx';
import { SignInRoute } from '@/features/authentication/sign-in/sign-in-route.tsx';
import { useAuthUser } from '@/features/authentication/stores/auth-store.ts';

const IsNotProtectedRoute = () => {
    const isAuthenticated = useAuthUser();
    return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
};

export const authRoutes: RouteObject[] = [
    {
        children: [
            {
                element: <SignInRoute />,
                path: '/',
            },
            {
                element: <RegistrationRoute />,
                path: '/sign-up',
            },
        ],
        element: <IsNotProtectedRoute />,
    },
];
