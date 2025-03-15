import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface ListContextProps {
    handleRefresh: () => void;
    key: string;
    refresh: number;
}

export const ListContext = createContext<ListContextProps>({
    handleRefresh: () => {},
    key: '',
    refresh: 0,
});

export function useListContext() {
    const context = useContext(ListContext);
    return context;
}

export function useInitializeListContext() {
    const [refresh, setRefresh] = useState(0);

    const handleRefresh = useCallback(() => {
        setRefresh(prev => prev + 1);
    }, []);

    const listContext = useMemo(() => ({ handleRefresh, key: 'album-list', refresh }), [handleRefresh, refresh]);
    return listContext;
}
