import { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { RouterProvider } from 'react-router-dom';
import type { queryClient } from '@/lib/react-query.ts';
import { router } from '@/routes/app-router.tsx';
import type { AuthSlice } from '@/store/auth-store.ts';
import { baseMantineTheme, themes } from '@/themes/index.ts';
import '@mantine/core/styles.css';
import 'overlayscrollbars/overlayscrollbars.css';
import './styles/global.scss';

export type RootContext = {
    auth: AuthSlice['user'];
    queryClient: typeof queryClient;
};

function App() {
    const [theme] = useLocalStorage({
        defaultValue: 'defaultDark',
        key: 'theme',
    });

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
            defaultColorScheme={themes[theme as keyof typeof themes].type}
            theme={baseMantineTheme}
        >
            <RouterProvider router={router} />
        </MantineProvider>
    );
}

export default App;
