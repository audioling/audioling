import type { ListSortOrder } from '@repo/shared-types';
import type { GridStateSnapshot } from 'react-virtuoso';
import type { ItemListColumnOrder } from '@/features/ui/item-list/helpers.ts';
import type {
    ItemListDisplayType,
    ItemListPaginationState,
    ItemListPaginationType,
} from '@/features/ui/item-list/types.ts';
import type { QueryFilter } from '@/features/ui/query-builder/query-builder.tsx';

export type ListStore<TSortBy> = {
    columnOrder: ItemListColumnOrder;
    displayType: ItemListDisplayType;
    folderId: string[];
    initialScrollIndex: number;
    isQueryBuilderOpen?: boolean;
    isQuerying?: 'force' | 'query' | boolean;
    listId: Record<string, string>;
    mode: 'online' | 'offline';
    pagination: ItemListPaginationState;
    paginationType: ItemListPaginationType;
    queryBuilder?: QueryFilter;
    setColumnOrder: (columnOrder: ItemListColumnOrder) => void;
    setDisplayType: (displayType: ItemListDisplayType) => void;
    setFolderId: (folderId: string[]) => void;
    setInitialScrollIndex: (initialScrollIndex: number) => void;
    setIsQuerying?: (isQuerying: 'force' | 'query' | boolean) => void;
    setListId: (key: string, id: string) => void;
    setPagination: (pagination: ItemListPaginationState) => void;
    setPaginationType: (paginationType: ItemListPaginationType) => void;
    setQueryBuilder?: (queryBuilder: QueryFilter) => void;
    setSortBy: (sortBy: TSortBy) => void;
    setSortOrder: (sortOrder: ListSortOrder) => void;
    setState: (key: string, state: GridStateSnapshot) => void;
    sortBy: TSortBy;
    sortOrder: ListSortOrder;
    state: Record<string, GridStateSnapshot>;
    toggleMode: () => void;
    toggleQueryBuilderOpen?: () => void;
};
