import { TrackListSortOptions } from '@repo/shared-types';
import { ListSortOrder } from '@repo/shared-types';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { ItemListDisplayType, ItemListPaginationType } from '@/features/ui/item-list/types.ts';
import { createSelectors } from '@/lib/zustand.ts';
import type { ListStore } from '@/store/list-store.ts';

type TrackListStore = ListStore<TrackListSortOptions>;

export const useTrackListStoreBase = create<TrackListStore>()(
    persist(
        subscribeWithSelector(
            immer((set) => ({
                columnOrder: [
                    ItemListColumn.ROW_INDEX,
                    ItemListColumn.IMAGE,
                    ItemListColumn.STANDALONE_COMBINED,
                    ItemListColumn.ALBUM,
                    ItemListColumn.FAVORITE,
                    ItemListColumn.ACTIONS,
                ],
                displayType: ItemListDisplayType.TABLE,
                folderId: [],
                initialScrollIndex: 0,
                isQueryBuilderOpen: true,
                isQuerying: false,
                listId: {},
                mode: 'offline',
                pagination: {
                    currentPage: 1,
                    itemsPerPage: 100,
                },
                paginationType: ItemListPaginationType.PAGINATED,
                queryBuilder: {
                    limit: undefined,
                    rules: {
                        conditions: [
                            {
                                condition: { contains: '' },
                                conditionId: nanoid(),
                                field: 'name',
                            },
                        ],
                        groupId: 'root',
                        operator: 'AND',
                    },
                    sortBy: [
                        {
                            direction: 'asc',
                            field: 'albumId',
                        },
                        {
                            direction: 'asc',
                            field: 'trackNumber',
                        },
                    ],
                },
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
                setIsQuerying: (isQuerying) => {
                    set((state) => {
                        state.isQuerying = isQuerying;
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
                setQueryBuilder: (queryBuilder) => {
                    set((state) => {
                        state.queryBuilder = queryBuilder;
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
                sortBy: TrackListSortOptions.NAME,
                sortOrder: ListSortOrder.ASC,
                state: {},
                toggleMode: () => {
                    set((state) => {
                        state.mode = state.mode === 'offline' ? 'online' : 'offline';
                    });
                },
                toggleQueryBuilderOpen: () => {
                    set((state) => {
                        state.isQueryBuilderOpen = !state.isQueryBuilderOpen;
                    });
                },
            })),
        ),
        {
            name: 'track-list-store',
            partialize: (state) => {
                return Object.fromEntries(
                    Object.entries(state).filter(([key]) => !['isQuerying'].includes(key)),
                );
            },
            version: 1,
        },
    ),
);

export const useTrackListStore = createSelectors(useTrackListStoreBase);
