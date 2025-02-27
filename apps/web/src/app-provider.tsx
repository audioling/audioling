import { MantineProvider } from '@mantine/core';
import { localize } from '@repo/localization';
import { I18nextProvider } from 'react-i18next';
import { AppRouter } from '/@/routes/app-router';
import { mantineCssVariableResolver } from '/@/styles/mantine-theme-css-variable-resolver';
import { useAppTheme } from '/@/styles/use-app-theme';

export function AppProvider() {
    const theme = useAppTheme();

    return (
        <I18nextProvider i18n={localize.instance}>
            <MantineProvider cssVariablesResolver={mantineCssVariableResolver} defaultColorScheme="dark" theme={theme}>
                <AppRouter />
            </MantineProvider>
        </I18nextProvider>
    );
}
