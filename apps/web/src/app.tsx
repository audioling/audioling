import React from 'react';
import { MantineProvider } from '@mantine/core';
import { QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from '@/lib/react-query.ts';
import { appRouter } from '@/routes/app-router.tsx';
import 'overlayscrollbars/overlayscrollbars.css';
import '@mantine/core/styles.css';
import '@/styles/global.scss';
import { baseMantineTheme } from '@/themes/index.ts';
import { useThemeVariables } from '@/themes/use-theme-variables.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <InnerApp />
        </QueryClientProvider>
    </React.StrictMode>,
);

function InnerApp() {
    const theme = 'defaultDark';

    useThemeVariables(theme);

    return (
        <MantineProvider classNamesPrefix="al" defaultColorScheme="dark" theme={baseMantineTheme}>
            <RouterProvider router={appRouter} />
        </MantineProvider>
    );
}
