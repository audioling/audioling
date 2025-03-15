import { useMantineColorScheme } from '@mantine/core';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router';
import { Toaster } from 'sonner';
import { AuthLayout } from '../layouts/auth-layout';
import { GlobalErrorBoundary } from '/@/components/error-boundary/error-boundary';
import { AlbumListRoute } from '/@/features/albums/routes/album-list-route';
import { ServerConnectionRoute } from '/@/features/authentication/routes/server-connection-route';
import { SignInRoute } from '/@/features/authentication/routes/sign-in-route';
import { HomeRoute } from '/@/features/home/routes/home-route';
import { AppLayout } from '/@/layouts/app-layout';
import { ProtectedLayout } from '/@/layouts/protected-layout';
import { AppRoute } from '/@/routes/types';

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<RootRoute />}>
                    <Route errorElement={<GlobalErrorBoundary />}>
                        <Route element={<AuthLayout />}>
                            <Route index element={<ServerConnectionRoute />} />
                            <Route element={<SignInRoute />} path={AppRoute.SIGN_IN} />
                        </Route>
                        <Route element={<ProtectedLayout />}>
                            <Route element={<AppLayout />}>
                                <Route index element={<HomeRoute />} path={AppRoute.APP} />
                                <Route element={<HomeRoute />} path={AppRoute.APP_HOME} />
                                <Route element={<AlbumListRoute />} path={AppRoute.APP_ALBUMS} />
                                <Route element={<></>} path={AppRoute.APP_ALBUM_ARTISTS} />
                                <Route element={<></>} path={AppRoute.APP_ARTISTS} />
                                <Route element={<></>} path={AppRoute.APP_PLAYLISTS} />
                                <Route element={<></>} path={AppRoute.APP_GENRES} />
                                <Route element={<></>} path={AppRoute.APP_TRACKS} />
                            </Route>
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

function RootRoute() {
    const colorScheme = useMantineColorScheme();

    return (
        <>
            <Toaster theme={colorScheme.colorScheme === 'dark' ? 'dark' : 'light'} />
            <Outlet />
        </>
    );
}
