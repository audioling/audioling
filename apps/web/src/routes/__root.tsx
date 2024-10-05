import { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import type { PostAuthSignIn200Data } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { Group } from '@/features/ui/group/group.tsx';
import { baseMantineTheme, themes } from '@/themes/index.ts';

interface RouteContext {
    user: PostAuthSignIn200Data;
}

export const Route = createRootRouteWithContext<RouteContext>()({
    component: RootComponent,
});

function RootComponent() {
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
            <Group>
                <Link to="/auth/sign-in">Sign In</Link>
                <Link to="/auth/sign-up">Register</Link>
            </Group>
            <Outlet />
            <TanStackRouterDevtools />
        </MantineProvider>
    );
}
