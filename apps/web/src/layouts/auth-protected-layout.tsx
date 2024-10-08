import { Navigate, Outlet } from 'react-router-dom';
import { useAuthUser } from '@/features/authentication/stores/auth-store.ts';
import { APP_ROUTE } from '@/routes/app-routes.ts';

export const AuthProtectedLayout = () => {
    const isAuthenticated = useAuthUser();
    return isAuthenticated ? <Outlet /> : <Navigate to={APP_ROUTE.SIGN_IN} />;
};
