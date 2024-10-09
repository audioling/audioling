import React, { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>,
);

function InnerApp() {
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
            <RouterProvider router={appRouter} />
        </MantineProvider>
    );
}
