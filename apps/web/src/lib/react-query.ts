import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {},
        queries: {
            gcTime: 1000 * 60 * 1,
            retry: (_failureCount, error) => {
                if (error instanceof AxiosError && error.status !== undefined) {
                    if (error.status >= 400 && error.status < 500) {
                        return false;
                    }

                    if (error.status === 500) {
                        return false;
                    }
                }

                return true;
            },
        },
    },
});
