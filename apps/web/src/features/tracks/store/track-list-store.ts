import { TrackListSortOptions } from '@repo/shared-types';
import { ListSortOrder } from '@repo/shared-types';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';
import { ItemListDisplayType, ItemListPaginationType } from '@/features/ui/item-list/types.ts';
import type { ListStore } from '@/store/list-store.ts';

type TrackListStore = ListStore<TrackListSortOptions>;

export const useTrackListStore = create<TrackListStore>()(
    persist(
        subscribeWithSelector(
            immer((set) => ({
                displayType: ItemListDisplayType.TABLE,
                initialScrollIndex: 0,
                listId: {},
                pagination: {
                    currentPage: 1,
                    itemsPerPage: 100,
                },
                paginationType: ItemListPaginationType.PAGINATED,
                setDisplayType: (displayType) => {
                    set((state) => {
                        state.displayType = displayType;
                        state.pagination.currentPage = 1;
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
                sortBy: TrackListSortOptions.NAME,
                sortOrder: ListSortOrder.ASC,
            })),
        ),
        { name: 'track-list-store', version: 1 },
    ),
);

export const useTrackListState = () => {
    return useTrackListStore(
        useShallow((state) => ({
            displayType: state.displayType,
            initialScrollIndex: state.initialScrollIndex,
            listId: state.listId,
            pagination: state.pagination,
            paginationType: state.paginationType,
            sortBy: state.sortBy,
            sortOrder: state.sortOrder,
        })),
    );
};

export const useTrackListActions = () => {
    return useTrackListStore(
        useShallow((state) => ({
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
