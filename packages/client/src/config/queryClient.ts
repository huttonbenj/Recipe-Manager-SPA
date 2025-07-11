import { QueryClient } from '@tanstack/react-query';
import { QUERY_CONFIG } from '@recipe-manager/shared';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: QUERY_CONFIG.RETRY.DEFAULT,
            refetchOnWindowFocus: false,
            staleTime: QUERY_CONFIG.STALE_TIME.DEFAULT,
        },
        mutations: {
            retry: QUERY_CONFIG.RETRY.MUTATIONS,
        },
    },
}); 