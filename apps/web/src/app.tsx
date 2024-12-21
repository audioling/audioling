import React, { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { initSimpleImg } from 'react-simple-img';
import { queryClient } from '@/lib/react-query.ts';
import { appRouter } from '@/routes/app-router.tsx';
import 'overlayscrollbars/overlayscrollbars.css';
import '@mantine/core/styles.layer.css';
import '@/styles/global.scss';
import { baseMantineTheme } from '@/themes/index.ts';
import { useThemeVariables } from '@/themes/use-theme-variables.ts';

initSimpleImg({ threshold: 0.05 }, true);

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
        const disableBrowserCtxMenu = (event: Event) => {
            event.preventDefault();
            return false;
        };

        document.addEventListener('contextmenu', disableBrowserCtxMenu);

        return () => {
            document.removeEventListener('contextmenu', disableBrowserCtxMenu);
        };
    }, []);

    useThemeVariables(theme);

    return (
        <MantineProvider classNamesPrefix="al" defaultColorScheme="dark" theme={baseMantineTheme}>
            <RouterProvider router={appRouter} />
        </MantineProvider>
    );
}
