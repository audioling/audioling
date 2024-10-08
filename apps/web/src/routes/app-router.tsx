import { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { authRoutes } from '@/routes/auth-routes.tsx';
import { dashboardRoutes } from '@/routes/dashboard/dashboard-routes.tsx';
import { baseMantineTheme, themes } from '@/themes/index.ts';

export const appRouter = createBrowserRouter([
    {
        children: [...authRoutes, ...dashboardRoutes],
        element: <RootRoute />,
        path: '/',
    },
]);

function RootRoute() {
    const theme = 'defaultDark';

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);

        if (theme) {
            for (const [key, value] of Object.entries(themes[theme as keyof typeof themes].theme)) {
                document.documentElement.style.setProperty(`--${key}`, value as string);
            }
        }
    }, [theme]);

    return (
        <MantineProvider
            classNamesPrefix="al"
            defaultColorScheme="dark"
            theme={baseMantineTheme}
        >
            <Outlet />
        </MantineProvider>
    );
}
