import { createRootRoute, Outlet } from '@tanstack/react-router';
import { SignInRoute } from '/@/features/authentication/sign-in/routes/sign-in-route';

export const Route = createRootRoute({
    component: RootRoute,
});

export function RootRoute() {
    const isAuthenticated = false;

    if (isAuthenticated) {
        return <Outlet />;
    }

    return <SignInRoute />;
}
