import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthLayout } from '../layouts/auth-layout';
import { GlobalErrorBoundary } from '/@/components/error-boundary/error-boundary';
import { ServerConnectionRoute } from '/@/features/authentication/routes/server-connection-route';
import { SignInRoute } from '/@/features/authentication/routes/sign-in-route';
import { ProtectedLayout } from '/@/layouts/protected-layout';
import { AppRoute } from '/@/routes/types';

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route errorElement={<GlobalErrorBoundary />}>
                        <Route index element={<ServerConnectionRoute />} />
                        <Route element={<SignInRoute />} path={AppRoute.SIGN_IN} />
                    </Route>
                </Route>
                <Route element={<ProtectedLayout />}>
                    <Route element={<></>} path={AppRoute.APP} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
