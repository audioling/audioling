import { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';
import { ItemListDisplayType, ItemListPaginationType } from '@/features/ui/item-list/types.ts';
import type { ListStore } from '@/store/list-store.ts';

type AlbumListStore = ListStore<AlbumListSortOptions>;

const albumListStore = create<AlbumListStore>()(
    persist(
        subscribeWithSelector(
            immer((set) => ({
                displayType: ItemListDisplayType.GRID,
                initialScrollIndex: 0,
                pagination: {
                    currentPage: 0,
                    itemsPerPage: 500,
                },
                paginationType: ItemListPaginationType.PAGINATED,
                setDisplayType: (displayType) => {
                    set((state) => {
                        state.displayType = displayType;
                    });
                },
                setInitialScrollIndex: (initialScrollIndex) => {
                    set((state) => {
                        state.initialScrollIndex = initialScrollIndex;
                    });
                },
                setPagination: (pagination) => {
                    set((state) => {
                        state.pagination = pagination;
                    });
                },
                setPaginationType: (paginationType) => {
                    set((state) => {
                        state.paginationType = paginationType;
                    });
                },
                setSortBy: (sortBy) => {
                    set((state) => {
                        state.sortBy = sortBy;
                    });
                },
                setSortOrder: (sortOrder) => {
                    set((state) => {
                        state.sortOrder = sortOrder;
                    });
                },
                sortBy: AlbumListSortOptions.NAME,
                sortOrder: ListSortOrder.ASC,
            })),
        ),
        { name: 'album-list-store', version: 1 },
    ),
);

export const useAlbumListState = () => {
    return albumListStore(
        useShallow((state) => ({
            displayType: state.displayType,
            initialScrollIndex: state.initialScrollIndex,
            pagination: state.pagination,
            paginationType: state.paginationType,
            sortBy: state.sortBy,
            sortOrder: state.sortOrder,
        })),
    );
};

export const useAlbumListActions = () => {
    return albumListStore(
        useShallow((state) => ({
            setDisplayType: state.setDisplayType,
            setInitialScrollIndex: state.setInitialScrollIndex,
            setPagination: state.setPagination,
            setPaginationType: state.setPaginationType,
            setSortBy: state.setSortBy,
            setSortOrder: state.setSortOrder,
        })),
    );
};
