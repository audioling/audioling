import type { AuthServer, ServerItemType } from '@repo/shared-types/app-types';

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

export interface ServerItemListProps<TParams> {
    itemSelectionType?: 'single' | 'multiple';
    pagination: ItemListPaginationState;
    params: TParams;
    server: AuthServer;
}
