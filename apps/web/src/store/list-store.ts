import type { ListSortOrder } from '@repo/shared-types';
import type {
    ItemListDisplayType,
    ItemListPaginationState,
    ItemListPaginationType,
} from '@/features/ui/item-list/types.ts';

export type ListStore<TSortBy> = {
    displayType: ItemListDisplayType;
    initialScrollIndex: number;
    pagination: ItemListPaginationState;
    paginationType: ItemListPaginationType;
    setDisplayType: (displayType: ItemListDisplayType) => void;
    setInitialScrollIndex: (initialScrollIndex: number) => void;
    setPagination: (pagination: ItemListPaginationState) => void;
    setPaginationType: (paginationType: ItemListPaginationType) => void;
    setSortBy: (sortBy: TSortBy) => void;
    setSortOrder: (sortOrder: ListSortOrder) => void;
    sortBy: TSortBy;
    sortOrder: ListSortOrder;
};
