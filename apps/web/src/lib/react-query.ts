import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {},
        queries: {
            // 20 seconds
            retry: (_failureCount, error) => {
                if (error instanceof AxiosError && error.status !== undefined) {
                    if (error.status >= 400 && error.status < 500) {
                        return false;
                    }
                }

                return true;
            },
        },
    },
});
