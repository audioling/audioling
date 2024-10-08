import { type RouteObject } from 'react-router-dom';
import { LibrarySelectionRoute } from '@/features/library/routes/library-selection-route.tsx';
import { AuthProtectedLayout } from '@/layouts/auth-protected-layout.tsx';
import { DashboardLayout } from '@/layouts/dashboard-layout.tsx';
import { LibraryIdSelectedLayout } from '@/layouts/library-id-selected-layout.tsx';

export const dashboardRoutes: RouteObject[] = [
    {
        children: [
            {
                children: [
                    {
                        children: [
                            {
                                children: [
                                    {
                                        children: [
                                            {
                                                element: <div>Hello, from home</div>,
                                                index: true,
                                                path: 'home',
                                            },
                                            {
                                                element: <div>Hello, from now-playing</div>,
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
                                        element: <LibraryIdSelectedLayout />,
                                    },
                                ],
                                element: <DashboardLayout />,
                                path: ':libraryId',
                            },
                            {
                                element: <LibrarySelectionRoute />,
                                index: true,
                                path: 'library-selection',
                            },
                            {
                                element: <LibrarySelectionRoute />,
                                index: true,
                            },
                        ],
                        path: 'dashboard',
                    },
                ],
            },
        ],
        element: <AuthProtectedLayout />,
    },
];
