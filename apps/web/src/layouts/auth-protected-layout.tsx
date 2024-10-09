import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthUser } from '@/features/authentication/stores/auth-store.ts';
import { APP_ROUTE } from '@/routes/app-routes.ts';

export const AuthProtectedLayout = () => {
    const isAuthenticated = useAuthUser();
    return isAuthenticated ? (
        <Suspense fallback={<></>}>
            <Outlet />
        </Suspense>
    ) : (
        <Navigate to={APP_ROUTE.SIGN_IN} />
    );
};
