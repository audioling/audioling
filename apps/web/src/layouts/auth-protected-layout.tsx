import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuthUser } from '@/features/authentication/stores/auth-store.ts';
import { APP_ROUTE } from '@/routes/app-routes.ts';

export function AuthProtectedLayout() {
    const isAuthenticated = useAuthUser();

    if (isAuthenticated) {
        return (
            <Suspense fallback={<></>}>
                <Outlet />
            </Suspense>
        );
    }

    return <Navigate to={APP_ROUTE.SIGN_IN} />;
}
