import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {},
        queries: {
            staleTime: 1000 * 20, // 20 seconds
        },
    },
});
