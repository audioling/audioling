import { GenreListSortOptions, ListSortOrder } from '@repo/shared-types';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';
import { ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { ItemListDisplayType, ItemListPaginationType } from '@/features/ui/item-list/types.ts';
import { createSelectors } from '@/lib/zustand.ts';
import type { ListStore } from '@/store/list-store.ts';

type GenreListStore = ListStore<GenreListSortOptions>;

export const useGenreListStoreBase = create<GenreListStore>()(
    persist(
        subscribeWithSelector(
            immer((set) => ({
                columnOrder: [
                    ItemListColumn.NAME,
                    ItemListColumn.ALBUM_COUNT,
                    ItemListColumn.TRACK_COUNT,
                    ItemListColumn.ACTIONS,
                ],
                displayType: ItemListDisplayType.GRID,
                folderId: [],
                initialScrollIndex: 0,
                listId: {},
                pagination: {
                    currentPage: 1,
                    itemsPerPage: 500,
                },
                paginationType: ItemListPaginationType.PAGINATED,
                setColumnOrder: (columnOrder) => {
                    set((state) => {
                        state.columnOrder = columnOrder;
                    });
                },
                setDisplayType: (displayType) => {
                    set((state) => {
                        state.displayType = displayType;
                        state.pagination.currentPage = 1;
                    });
                },
                setFolderId: (folderId) => {
                    set((state) => {
                        state.folderId = folderId;
                    });
                },
                setInitialScrollIndex: (initialScrollIndex) => {
                    set((state) => {
                        state.initialScrollIndex = initialScrollIndex;
                    });
                },
                setListId: (key, id) => {
                    set((state) => {
                        state.listId[key] = id;
                        state.pagination.currentPage = 1;
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
                        state.pagination.currentPage = 1;
                    });
                },
                setSortBy: (sortBy) => {
                    set((state) => {
                        state.sortBy = sortBy;
                        state.pagination.currentPage = 1;
                    });
                },
                setSortOrder: (sortOrder) => {
                    set((state) => {
                        state.sortOrder = sortOrder;
                    });
                },
                setState: (key, listState) => {
                    set((state) => {
                        state.state[key] = listState;
                    });
                },
                sortBy: GenreListSortOptions.NAME,
                sortOrder: ListSortOrder.ASC,
                state: {},
            })),
        ),
        { name: 'genre-list-store', version: 1 },
    ),
);

export const useGenreListStore = createSelectors(useGenreListStoreBase);

export const useGenreListActions = () => {
    return useGenreListStoreBase(
        useShallow((state) => ({
            setColumnOrder: state.setColumnOrder,
            setDisplayType: state.setDisplayType,
            setInitialScrollIndex: state.setInitialScrollIndex,
            setListId: state.setListId,
            setPagination: state.setPagination,
            setPaginationType: state.setPaginationType,
            setSortBy: state.setSortBy,
            setSortOrder: state.setSortOrder,
        })),
    );
};
