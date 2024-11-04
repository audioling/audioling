export enum ItemListDisplayType {
    GRID = 'grid',
    LIST = 'list',
}

export enum ItemListPaginationType {
    INFINITE = 'infinite',
    PAGINATED = 'paginated',
}

export type ItemListPaginationState = {
    currentPage: number;
    itemsPerPage: number;
};
