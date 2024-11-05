import { useEffect } from 'react';
import type { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import type { ItemListDisplayType } from '@/features/ui/item-list/types.ts';
import { randomString } from '@/utils/random-string.ts';

interface UseListInitializeProps {
    setListId: (key: string, listId: string) => void;
}

export function useListInitialize({ setListId }: UseListInitializeProps) {
    const location = useLocation();
    const id = randomString(12);

    useEffect(() => {
        setListId(location.pathname, id);
    }, [id, location.pathname, setListId]);

    return id;
}

interface UseListKeyProps {
    displayType: ItemListDisplayType;
    listId: Record<string, string>;
    sortBy: AlbumListSortOptions;
    sortOrder: ListSortOrder;
}

export function useListKey({ sortBy, sortOrder, displayType, listId }: UseListKeyProps) {
    const location = useLocation();

    return `${sortBy}-${sortOrder}-${displayType}-${listId[location.pathname]}`;
}

interface UseRefreshListProps {
    queryKey: string[];
    setListId: (pathname: string, listId: string) => void;
}

export function useRefreshList({ queryKey, setListId }: UseRefreshListProps) {
    const location = useLocation();
    const queryClient = useQueryClient();

    const handleRefresh = async () => {
        await queryClient.invalidateQueries({ queryKey });
        setListId(location.pathname, randomString(12));
    };

    return handleRefresh;
}
