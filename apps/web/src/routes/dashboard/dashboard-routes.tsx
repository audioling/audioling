import { type RouteObject } from 'react-router-dom';
import { AlbumListRoute } from '@/features/albums/list/album-list-route.tsx';
import { HomeRoute } from '@/features/dashboard/home/home-route.tsx';
import { AuthLibraryEditRoute } from '@/features/library/auth-library-edit/auth-library-edit-route.tsx';
import { LibraryAddRoute } from '@/features/library/library-add/library-add-route.tsx';
import { LibraryEditRoute } from '@/features/library/library-edit/library-edit-route.tsx';
import { LibrarySelectionRoute } from '@/features/library/library-selection/library-selection-route.tsx';
import { NowPlayingRoute } from '@/features/player/now-playing/now-playing-route.tsx';
import { TrackListRoute } from '@/features/tracks/list/track-list-route.tsx';
import { AuthProtectedLayout } from '@/layouts/auth-protected-layout.tsx';
import { DashboardLayout } from '@/layouts/dashboard-layout.tsx';
import { LibraryIdSelectedLayout } from '@/layouts/library-id-selected-layout.tsx';

const albumRoutes: RouteObject[] = [
    {
        element: <AlbumListRoute />,
        path: 'albums',
    },
    {
        element: <></>,
        path: 'albums/:albumId',
    },
];

const trackRoutes: RouteObject[] = [
    {
        element: <TrackListRoute />,
        path: 'tracks',
    },
];

export const dashboardRoutes: RouteObject[] = [
    {
        children: [
            {
                children: [
                    {
                        children: [
                            ...albumRoutes,
                            ...trackRoutes,
                            {
                                element: <HomeRoute />,
                                index: true,
                                path: 'home',
                            },
                            {
                                element: <NowPlayingRoute />,
                                path: 'now-playing',
                            },
                            {
                                element: <div>Hello, from library</div>,
                                path: 'library',
                            },
                            {
                                element: <div>Hello, from search</div>,
                                path: 'search',
                            },
                            {
                                element: <div>Hello, from 404</div>,
                                path: '*',
                            },
                        ],
                        element: <DashboardLayout />,
                        path: ':libraryId',
                    },
                    {
                        element: <LibrarySelectionRoute />,
                        path: 'library',
                    },
                    {
                        element: <LibraryAddRoute />,
                        path: 'library/add',
                    },
                    {
                        element: <AuthLibraryEditRoute />,
                        path: 'library/:libraryId/auth',
                    },
                    {
                        element: <LibraryEditRoute />,
                        path: 'library/:libraryId/edit',
                    },
                    {
                        element: <LibraryIdSelectedLayout />,
                        index: true,
                    },
                ],
                path: 'dashboard',
            },
        ],
        element: <AuthProtectedLayout />,
    },
];
