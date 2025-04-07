import { QueryClient } from '@tanstack/react-query';
import { toMs } from '/@/utils/to-ms';

export const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {
            onError: (error, variables, context) => {
                console.error(error, variables, context);
            },
        },
        queries: {
            gcTime: toMs.minutes(1),
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            staleTime: toMs.seconds(10),
        },
    },
});
