import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {
            onError: (error, variables, context) => {
                console.error(error, variables, context);
            },
        },
        queries: {
            gcTime: 1000 * 10,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            staleTime: 0,
        },
    },
});
