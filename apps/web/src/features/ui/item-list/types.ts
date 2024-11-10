import type { LibraryItemType } from '@repo/shared-types';

export enum ItemListDisplayType {
    GRID = 'grid',
    TABLE = 'table',
}

export enum ItemListPaginationType {
    INFINITE = 'infinite',
    PAGINATED = 'paginated',
}

export type ItemListPaginationState = {
    currentPage: number;
    itemsPerPage: number;
};

export type ItemListSelection = {
    selected: {
        id: string;
        type: LibraryItemType;
    }[];
};
