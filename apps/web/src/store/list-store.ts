import type { ListSortOrder } from '@repo/shared-types';
import type { GridStateSnapshot } from 'react-virtuoso';
import type { ItemListColumnOrder } from '@/features/ui/item-list/helpers.ts';
import type {
    ItemListDisplayType,
    ItemListPaginationState,
    ItemListPaginationType,
} from '@/features/ui/item-list/types.ts';

export type ListStore<TSortBy> = {
    columnOrder: ItemListColumnOrder;
    displayType: ItemListDisplayType;
    folderId: string[];
    initialScrollIndex: number;
    listId: Record<string, string>;
    pagination: ItemListPaginationState;
    paginationType: ItemListPaginationType;
    setColumnOrder: (columnOrder: ItemListColumnOrder) => void;
    setDisplayType: (displayType: ItemListDisplayType) => void;
    setFolderId: (folderId: string[]) => void;
    setInitialScrollIndex: (initialScrollIndex: number) => void;
    setListId: (key: string, id: string) => void;
    setPagination: (pagination: ItemListPaginationState) => void;
    setPaginationType: (paginationType: ItemListPaginationType) => void;
    setSortBy: (sortBy: TSortBy) => void;
    setSortOrder: (sortOrder: ListSortOrder) => void;
    setState: (key: string, state: GridStateSnapshot) => void;
    sortBy: TSortBy;
    sortOrder: ListSortOrder;
    state: Record<string, GridStateSnapshot>;
};
