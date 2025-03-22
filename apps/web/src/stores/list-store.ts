import type { ItemListPaginationState } from '/@/features/shared/components/item-list/types';
import type { ItemListColumnOrder } from '/@/features/shared/components/item-list/utils/helpers';
import merge from 'lodash/merge';
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';
import { ItemListDisplayType, ItemListPaginationType } from '/@/features/shared/components/item-list/types';
import { createSelectors } from '/@/lib/zustand';

interface State {
    store: Record<string, {
        columnOrder: ItemListColumnOrder;
        displayType: ItemListDisplayType;
        initialScrollIndex: number;
        pagination: ItemListPaginationState;
        paginationType: ItemListPaginationType;
        params: Record<string, unknown>;
    }>;
}

export interface Actions {
    setColumnOrder: (key: string, columnOrder: ItemListColumnOrder) => void;
    setDisplayType: (key: string, displayType: ItemListDisplayType) => void;
    setInitialScrollIndex: (key: string, initialScrollIndex: number) => void;
    setPagination: (key: string, pagination: ItemListPaginationState) => void;
    setPaginationType: (key: string, paginationType: ItemListPaginationType) => void;
    setParams: (key: string, params: Record<string, unknown>) => void;
}

function setDefaultStore(key: string, state: State) {
    if (!state.store[key]) {
        state.store[key] = {
            columnOrder: [],
            displayType: ItemListDisplayType.GRID,
            initialScrollIndex: 0,
            pagination: {
                currentPage: 1,
                itemsPerPage: 100,
            },
            paginationType: ItemListPaginationType.INFINITE,
            params: {},
        };
    }
}

export const useListStoreBase = create<State & Actions>()(
    devtools(
        persist(
            subscribeWithSelector(
                immer(set => ({
                    setColumnOrder: (key, columnOrder) => {
                        set((state) => {
                            if (!state.store[key]) {
                                setDefaultStore(key, state);
                            }

                            state.store[key].columnOrder = columnOrder;
                        });
                    },
                    setDisplayType: (key, displayType) => {
                        set((state) => {
                            if (!state.store[key]) {
                                setDefaultStore(key, state);
                            }

                            state.store[key].displayType = displayType;
                        });
                    },
                    setInitialScrollIndex: (key, initialScrollIndex) => {
                        set((state) => {
                            if (!state.store[key]) {
                                setDefaultStore(key, state);
                            }

                            state.store[key].initialScrollIndex = initialScrollIndex;
                        });
                    },
                    setPagination: (key, pagination) => {
                        set((state) => {
                            if (!state.store[key]) {
                                setDefaultStore(key, state);
                            }

                            state.store[key].pagination = pagination;
                        });
                    },
                    setPaginationType: (key, paginationType) => {
                        set((state) => {
                            if (!state.store[key]) {
                                setDefaultStore(key, state);
                            }

                            state.store[key].paginationType = paginationType;
                        });
                    },
                    setParams: (key, params) => {
                        set((state) => {
                            if (!state.store[key]) {
                                setDefaultStore(key, state);
                            }

                            for (const [k, v] of Object.entries(params)) {
                                state.store[key].params[k] = v;
                            }
                        });
                    },
                    store: {},
                })),
            ),
            {
                merge: (persistedState, currentState) => merge(currentState, persistedState),
                name: 'list-store',
                version: 1,
            },
        ),
    ),
);

export const useListStore = createSelectors(useListStoreBase);

export function useListStoreParams<T>(
    key: string,
    options?: {
        defaults?: T extends Record<string, unknown> ? T : Record<string, unknown>;
        overrides?: T extends Record<string, unknown> ? Partial<T> : Record<string, unknown>;
    },
) {
    const { params } = useListStoreBase(useShallow(state => state.store[key])) || {};
    const setParams = useListStore.use.setParams();

    return {
        params: {
            ...options?.defaults,
            ...params,
            ...options?.overrides,
        } as T,
        setParams,
    };
}

export function useListStoreOptions(key: string, defaults?: {
    columnOrder?: ItemListColumnOrder;
    displayType?: ItemListDisplayType;
    initialScrollIndex?: number;
    pagination?: ItemListPaginationState;
    paginationType?: ItemListPaginationType;
}) {
    const {
        columnOrder,
        displayType,
        initialScrollIndex,
        pagination,
        paginationType,
    } = useListStoreBase(useShallow(state => state.store[key])) || {};

    const setDisplayType = useListStore.use.setDisplayType();
    const setPagination = useListStore.use.setPagination();
    const setPaginationType = useListStore.use.setPaginationType();
    const setColumnOrder = useListStore.use.setColumnOrder();

    const options = {
        columnOrder,
        displayType,
        initialScrollIndex,
        pagination,
        paginationType,
        setColumnOrder,
        setDisplayType,
        setPagination,
        setPaginationType,
    };

    // Remove all entries that are undefined
    Object.entries(options).forEach(([key, value]) => {
        if (value === undefined) {
            delete options[key as keyof typeof options];
        }
    });

    return {
        ...defaults,
        ...options,
    };
}
