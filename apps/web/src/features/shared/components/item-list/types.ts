import type { ServerItemType } from '@repo/shared-types/app-types';

export enum ItemListDisplayType {
    GRID = 'grid',
    TABLE = 'table',
}

export enum ItemListPaginationType {
    INFINITE = 'infinite',
    PAGINATED = 'paginated',
}

export interface ItemListPaginationState {
    currentPage: number;
    itemsPerPage: number;
}

export interface ItemListSelection {
    selected: {
        id: string;
        type: ServerItemType;
    }[];
}
