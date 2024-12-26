import { generatePath, Navigate, Outlet, type RouteObject } from 'react-router';
import { RegistrationRoute } from '@/features/authentication/registration/registration-route.tsx';
import { SignInRoute } from '@/features/authentication/sign-in/sign-in-route.tsx';
import { useAuthUser, useSelectedLibraryId } from '@/features/authentication/stores/auth-store.ts';
import { APP_ROUTE } from '@/routes/app-routes.ts';

const IsNotProtectedRoute = () => {
    const isAuthenticated = useAuthUser();

    const selectedLibraryId = useSelectedLibraryId();

    if (!isAuthenticated) {
        return <Outlet />;
    }

    if (selectedLibraryId === null) {
        return <Navigate to={APP_ROUTE.DASHBOARD_LIBRARY_SELECT} />;
    }

    return (
        <Navigate to={generatePath(APP_ROUTE.DASHBOARD_HOME, { libraryId: selectedLibraryId })} />
    );
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
