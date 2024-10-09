import { type RouteObject } from 'react-router-dom';
import { AuthLibraryEditRoute } from '@/features/library/auth-library-edit/auth-library-edit-route.tsx';
import { LibraryAddRoute } from '@/features/library/library-add/library-add-route.tsx';
import { LibraryEditRoute } from '@/features/library/library-edit/library-edit-route.tsx';
import { LibrarySelectionRoute } from '@/features/library/library-selection/library-selection-route.tsx';
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
            },
        ],
        element: <AuthProtectedLayout />,
    },
];
