import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { QueueGroupingProperty } from '@/features/player/stores/player-store.tsx';
import { ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { createSelectors } from '@/lib/zustand.ts';

export type SettingsStoreState = {
    player: {
        queue: {
            columnOrder: ItemListColumn[];
            groupBy: QueueGroupingProperty | undefined;
        };
        sideQueue: {
            columnOrder: ItemListColumn[];
            groupBy: QueueGroupingProperty | undefined;
        };
    };
};

export type SettingsStoreActions = {
    setState: <Type, Path extends string[]>(path: [...Path], value: Type) => void;
};

export type SettingsStore = SettingsStoreState & SettingsStoreActions;

export const useSettingsStoreBase = create<SettingsStore>()(
    persist(
        subscribeWithSelector(
            immer((set) => ({
                player: {
                    queue: {
                        columnOrder: [
                            ItemListColumn.ROW_INDEX,
                            ItemListColumn.IMAGE,
                            ItemListColumn.STANDALONE_COMBINED,
                            ItemListColumn.ARTISTS,
                            ItemListColumn.DURATION,
                            ItemListColumn.ALBUM,
                        ],
                        groupBy: undefined,
                    },
                    sideQueue: {
                        columnOrder: [
                            ItemListColumn.ROW_INDEX,
                            ItemListColumn.IMAGE,
                            ItemListColumn.STANDALONE_COMBINED,
                            ItemListColumn.FAVORITE,
                            ItemListColumn.DURATION,
                        ],
                        groupBy: undefined,
                    },
                },
                setState: (path, value) =>
                    set((state) => {
                        let current: unknown = state;
                        for (let i = 0; i < path.length - 1; i++) {
                            current = (current as Record<string, unknown>)[path[i]];
                        }
                        (current as Record<string, unknown>)[path[path.length - 1]] = value;
                    }),
            })),
        ),
        {
            name: 'settings-store',
            version: 2,
        },
    ),
);

export const useSettingsStore = createSelectors(useSettingsStoreBase);
