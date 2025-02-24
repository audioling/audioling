import { MantineProvider } from '@mantine/core';
import { localize } from '@repo/localization';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import '@mantine/core/styles.css';
import '/@/styles/mantine-theme.css';
import '/@/styles/global.css';
import { routeTree } from '/@/routeTree.gen';
import { mantineTheme } from '/@/styles/mantine-theme';
import { mantineCssVariableResolver } from '/@/styles/mantine-theme-css-variable-resolver';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <I18nextProvider i18n={localize.instance}>
            <MantineProvider
                cssVariablesResolver={mantineCssVariableResolver}
                defaultColorScheme="dark"
                theme={mantineTheme}
            >
                <RouterProvider router={router} />
            </MantineProvider>
        </I18nextProvider>
    </React.StrictMode>,
);
