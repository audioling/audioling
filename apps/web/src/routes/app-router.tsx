import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AuthenticationRoute } from '@/features/authentication/page/authentication-route.tsx';
import { ListExample } from '@/features/now-playing/now-playing.tsx';
import { AppLayout } from '@/layouts/app/app-layout';
import { useAuthUser } from '@/store/auth-store.ts';

const Root = () => {
    const user = useAuthUser();
    return user ? <Navigate to="/app" /> : <Navigate to="/sign-in" />;
};

const ProtectedRoutes = () => {
    const user = useAuthUser();
    return user ? <Outlet /> : <Navigate to="/sign-in" />;
};

export const router = createBrowserRouter([
    {
        element: <Root />,
        path: '/',
    },
    {
        element: <AuthenticationRoute />,
        path: '/sign-in',
    },
    {
        children: [
            {
                children: [
                    {
                        element: <ListExample />,
                        index: true,
                        path: 'now-playing',
                    },
                ],
                element: <AppLayout />,
            },
        ],
        element: <ProtectedRoutes />,
        path: '/app',
    },
]);
