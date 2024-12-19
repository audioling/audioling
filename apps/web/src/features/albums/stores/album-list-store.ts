import { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { ItemListDisplayType, ItemListPaginationType } from '@/features/ui/item-list/types.ts';
import { createSelectors } from '@/lib/zustand.ts';
import type { ListStore } from '@/store/list-store.ts';

type AlbumListStore = ListStore<AlbumListSortOptions>;

export const useAlbumListStoreBase = create<AlbumListStore>()(
    persist(
        subscribeWithSelector(
            immer((set) => ({
                columnOrder: [
                    ItemListColumn.ROW_INDEX,
                    ItemListColumn.IMAGE,
                    ItemListColumn.NAME,
                    ItemListColumn.ARTISTS,
                    ItemListColumn.ACTIONS,
                ],
                displayType: ItemListDisplayType.GRID,
                folderId: [],
                initialScrollIndex: 0,
                listId: {},
                pagination: {
                    currentPage: 1,
                    itemsPerPage: 100,
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
                sortBy: AlbumListSortOptions.NAME,
                sortOrder: ListSortOrder.ASC,
            })),
        ),
        { name: 'album-list-store', version: 1 },
    ),
);

export const useAlbumListStore = createSelectors(useAlbumListStoreBase);
