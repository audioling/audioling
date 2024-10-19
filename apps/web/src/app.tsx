import React, { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from '@/lib/react-query.ts';
import { appRouter } from '@/routes/app-router.tsx';
import '@mantine/core/styles.css';
import '@/styles/global.scss';
import { baseMantineTheme, themes } from '@/themes/index.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <InnerApp />
        </QueryClientProvider>
    </React.StrictMode>,
);

function InnerApp() {
    const theme = 'defaultDark';

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);

        if (theme) {
            for (const [key, value] of Object.entries(themes[theme as keyof typeof themes].theme)) {
                if (key === 'layout-border-color') {
                    document.documentElement.style.setProperty(
                        `--separator-border`,
                        value as string,
                    );
                } else if (key === 'layout-border-focus-color') {
                    document.documentElement.style.setProperty(`--focus-border`, value as string);
                } else {
                    document.documentElement.style.setProperty(`--${key}`, value as string);
                }
            }
        }
    }, [theme]);

    return (
        <MantineProvider classNamesPrefix="al" defaultColorScheme="dark" theme={baseMantineTheme}>
            <RouterProvider router={appRouter} />
        </MantineProvider>
    );
}
