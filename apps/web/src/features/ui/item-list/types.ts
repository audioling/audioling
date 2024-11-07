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
