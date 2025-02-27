import { MantineProvider } from '@mantine/core';
import { localize } from '@repo/localization';
import { QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { queryClient } from '/@/lib/react-query';
import { AppRouter } from '/@/routes/app-router';
import { mantineCssVariableResolver } from '/@/styles/mantine-theme-css-variable-resolver';
import { useAppTheme } from '/@/styles/use-app-theme';

export function AppProvider() {
    const theme = useAppTheme();

    return (
        <I18nextProvider i18n={localize.instance}>
            <QueryClientProvider client={queryClient}>
                <MantineProvider
                    cssVariablesResolver={mantineCssVariableResolver}
                    defaultColorScheme="dark"
                    theme={theme}
                >
                    <AppRouter />
                </MantineProvider>
            </QueryClientProvider>
        </I18nextProvider>
    );
}
