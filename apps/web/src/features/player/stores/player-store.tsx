import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import type { QueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';
import type { PlayQueueItem, TrackItem } from '@/api/api-types.ts';
import { fetchTracksByAlbumId } from '@/api/fetchers/albums.ts';
import type { GetApiLibraryIdAlbumsIdTracksParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { createSelectors } from '@/lib/zustand.ts';
import { shuffleInPlace } from '@/utils/shuffle.ts';

export enum PlayerStatus {
    PAUSED = 'paused',
    PLAYING = 'playing',
}

export enum PlayerRepeat {
    ALBUM = 'album',
    ALL = 'all',
    OFF = 'off',
    ONE = 'one',
}

export enum PlayerShuffle {
    ALBUM = 'album',
    OFF = 'off',
    TRACK = 'track',
}

export interface PlayerData {
    current: {
        index: number;
        nextIndex?: number;
        player: 1 | 2;
        previousIndex?: number;
        shuffledIndex: number;
        status: PlayerStatus;
        track?: PlayQueueItem;
    };
    player1?: PlayQueueItem;
    player2?: PlayQueueItem;
    queue: {
        current?: PlayQueueItem;
        currentIndex: number;
        length: number;
        next?: PlayQueueItem;
        previous?: PlayQueueItem;
    };
}

export enum PlayType {
    INDEX = 'index',
    LAST = 'last',
    NEXT = 'next',
    NOW = 'now',
}

export interface QueueData {
    default: PlayQueueItem[];
    priority: PlayQueueItem[];
}

export enum QueueType {
    DEFAULT = 'default',
    PRIORITY = 'priority',
}

interface GroupedQueue {
    groups: { count: number; name: string }[];
    items: PlayQueueItem[];
}

export type QueueGroupingProperty = keyof PlayQueueItem;

interface Actions {
    addToQueueByType: (items: TrackItem[], playType: PlayType) => void;
    addToQueueByUniqueId: (items: TrackItem[], uniqueId: string, edge: 'top' | 'bottom') => void;
    clearQueue: () => void;
    clearSelected: (items: PlayQueueItem[]) => void;
    decreaseVolume: (value: number) => void;
    getQueue: (groupBy?: QueueGroupingProperty) => GroupedQueue;
    getQueueOrder: () => {
        groups: { count: number; name: string }[];
        items: PlayQueueItem[];
    };
    increaseVolume: (value: number) => void;
    mediaNext: () => void;
    mediaPause: () => void;
    mediaPlay: () => void;
    mediaPrevious: () => void;
    mediaStepBackward: () => void;
    mediaStepForward: () => void;
    mediaTogglePlayPause: () => void;
    moveSelectedTo: (items: PlayQueueItem[], uniqueId: string, edge: 'top' | 'bottom') => void;
    moveSelectedToBottom: (items: PlayQueueItem[]) => void;
    moveSelectedToNext: (items: PlayQueueItem[]) => void;
    moveSelectedToTop: (items: PlayQueueItem[]) => void;
    setVolume: (volume: number) => void;
    shuffle: () => void;
    shuffleSelected: (items: PlayQueueItem[]) => void;
}

interface State {
    player: {
        index: number;
        muted: boolean;
        playerNum: 1 | 2;
        repeat: PlayerRepeat;
        shuffle: PlayerShuffle;
        speed: number;
        status: PlayerStatus;
        timestamp: number;
        volume: number;
    };
    queue: QueueData;
}

export interface PlayerState extends State, Actions {}

export const usePlayerStoreBase = create<PlayerState>()(
    persist(
        subscribeWithSelector(
            immer((set, get) => ({
                addToQueueByType: (items, playType) => {
                    const newItems = items.map(toPlayQueueItem);

                    const queueType = getQueueType();

                    switch (queueType) {
                        case QueueType.DEFAULT: {
                            switch (playType) {
                                case PlayType.NOW: {
                                    set((state) => {
                                        state.queue.default = [];
                                        state.player.index = 0;
                                        state.queue.default = newItems;
                                    });
                                    break;
                                }
                                case PlayType.NEXT: {
                                    set((state) => {
                                        const currentIndex = state.player.index;
                                        state.queue.default = [
                                            ...state.queue.default.slice(0, currentIndex + 1),
                                            ...newItems,
                                            ...state.queue.default.slice(currentIndex + 1),
                                        ];
                                    });
                                    break;
                                }
                                case PlayType.LAST: {
                                    set((state) => {
                                        state.queue.default = [...state.queue.default, ...newItems];
                                    });
                                    break;
                                }
                            }
                            break;
                        }
                        case QueueType.PRIORITY: {
                            switch (playType) {
                                case PlayType.NOW: {
                                    set((state) => {
                                        state.queue.default = [];

                                        // Add the first item to the top of the priority queue and the rest to the bottom of the default queue
                                        state.queue.priority = [
                                            ...newItems.slice(0, 1),
                                            ...state.queue.priority.slice(1),
                                        ];

                                        state.queue.default = [
                                            ...state.queue.default,
                                            ...newItems.slice(1),
                                        ];

                                        state.player.index = 0;
                                    });
                                    break;
                                }
                                case PlayType.NEXT: {
                                    set((state) => {
                                        const currentIndex = state.player.index;
                                        const isInPriority =
                                            currentIndex < state.queue.priority.length;

                                        if (isInPriority) {
                                            state.queue.priority = [
                                                ...state.queue.priority.slice(0, currentIndex + 1),
                                                ...newItems,
                                                ...state.queue.priority.slice(currentIndex + 1),
                                            ];
                                        } else {
                                            state.queue.priority = [
                                                ...state.queue.priority,
                                                ...newItems,
                                            ];
                                        }
                                    });
                                    break;
                                }
                                case PlayType.LAST: {
                                    set((state) => {
                                        state.queue.priority = [
                                            ...state.queue.priority,
                                            ...newItems,
                                        ];
                                    });
                                    break;
                                }
                            }
                            break;
                        }
                    }
                },
                addToQueueByUniqueId: (items, uniqueId, edge) => {
                    const newItems = items.map(toPlayQueueItem);
                    const queueType = getQueueType();

                    set((state) => {
                        if (queueType === QueueType.DEFAULT) {
                            const index = state.queue.default.findIndex(
                                (item) => item._uniqueId === uniqueId,
                            );

                            const insertIndex = Math.max(0, edge === 'top' ? index : index + 1);

                            state.queue.default = [
                                ...state.queue.default.slice(0, insertIndex),
                                ...newItems,
                                ...state.queue.default.slice(insertIndex),
                            ];
                        } else {
                            const priorityIndex = state.queue.priority.findIndex(
                                (item) => item._uniqueId === uniqueId,
                            );

                            if (priorityIndex !== -1) {
                                const insertIndex = Math.max(
                                    0,
                                    edge === 'top' ? priorityIndex : priorityIndex + 1,
                                );

                                state.queue.priority = [
                                    ...state.queue.priority.slice(0, insertIndex),
                                    ...newItems,
                                    ...state.queue.priority.slice(insertIndex),
                                ];
                            } else {
                                const defaultIndex = state.queue.default.findIndex(
                                    (item) => item._uniqueId === uniqueId,
                                );

                                if (defaultIndex !== -1) {
                                    const insertIndex = Math.max(
                                        0,
                                        edge === 'top' ? defaultIndex : defaultIndex + 1,
                                    );

                                    state.queue.default = [
                                        ...state.queue.default.slice(0, insertIndex),
                                        ...newItems,
                                        ...state.queue.default.slice(insertIndex),
                                    ];
                                }
                            }
                        }
                    });
                },
                clearQueue: () => {
                    set((state) => {
                        state.queue.default = [];
                        state.queue.priority = [];
                    });
                },
                clearSelected: (items: PlayQueueItem[]) => {
                    set((state) => {
                        const uniqueIds = items.map((item) => item._uniqueId);

                        state.queue.default = state.queue.default.filter(
                            (item) => !uniqueIds.includes(item._uniqueId),
                        );

                        state.queue.priority = state.queue.priority.filter(
                            (item) => !uniqueIds.includes(item._uniqueId),
                        );
                    });
                },
                decreaseVolume: (value: number) => {
                    set((state) => {
                        state.player.volume = Math.max(0, state.player.volume - value);
                    });
                },
                getQueue: (groupBy?: QueueGroupingProperty) => {
                    const queue = get().getQueueOrder();
                    const queueType = getQueueType();

                    if (!groupBy || queueType === QueueType.PRIORITY) {
                        return queue;
                    }

                    // Track groups in order of appearance
                    const groups: { count: number; name: string }[] = [];
                    const seenGroups = new Set<string>();

                    // Process items and build groups in order
                    queue.items.forEach((item) => {
                        const groupValue = String(item[groupBy] || 'Unknown');

                        if (!seenGroups.has(groupValue)) {
                            seenGroups.add(groupValue);
                            groups.push({ count: 1, name: groupValue });
                        } else {
                            // Find the last occurrence of this group value
                            const lastIndex = [...groups]
                                .reverse()
                                .findIndex((g) => g.name === groupValue);
                            if (lastIndex === -1) return;

                            // If the previous group is different, create a new group
                            const previousGroup = groups[groups.length - 1];
                            if (previousGroup.name !== groupValue) {
                                groups.push({ count: 1, name: groupValue });
                            } else {
                                // Increment the count of the last matching group
                                groups[groups.length - 1].count++;
                            }
                        }
                    });

                    return { groups, items: queue.items };
                },
                getQueueOrder: () => {
                    const queueType = getQueueType();

                    if (queueType === QueueType.PRIORITY) {
                        const defaultQueue = get().queue.default;
                        const priorityQueue = get().queue.priority;

                        return {
                            groups: [
                                { count: priorityQueue.length, name: 'Priority' },
                                { count: defaultQueue.length, name: 'Default' },
                            ],
                            items: [...priorityQueue, ...defaultQueue],
                        };
                    }

                    const defaultQueue = get().queue.default;

                    return {
                        groups: [{ count: defaultQueue.length, name: 'All' }],
                        items: defaultQueue,
                    };
                },
                increaseVolume: (value: number) => {
                    set((state) => {
                        state.player.volume = Math.min(100, state.player.volume + value);
                    });
                },
                mediaNext: () => {
                    const currentIndex = get().player.index;
                    const queue = get().getQueueOrder();

                    set((state) => {
                        state.player.index = Math.min(queue.items.length - 1, currentIndex + 1);
                    });
                },
                mediaPause: () => {
                    set((state) => {
                        state.player.status = PlayerStatus.PAUSED;
                    });
                },
                mediaPlay: () => {
                    set((state) => {
                        state.player.status = PlayerStatus.PLAYING;
                    });
                },
                mediaPrevious: () => {
                    const currentIndex = get().player.index;

                    set((state) => {
                        // Only decrement if we're not at the start
                        state.player.index = Math.max(0, currentIndex - 1);
                    });
                },
                mediaStepBackward: () => {
                    set((state) => {
                        state.mediaPrevious();
                    });
                },
                mediaStepForward: () => {
                    set((state) => {
                        state.mediaNext();
                    });
                },
                mediaTogglePlayPause: () => {
                    set((state) => {
                        if (state.player.status === PlayerStatus.PLAYING) {
                            state.mediaPause();
                        } else {
                            state.mediaPlay();
                        }
                    });
                },
                moveSelectedTo: (
                    items: PlayQueueItem[],
                    uniqueId: string,
                    edge: 'top' | 'bottom',
                ) => {
                    const queueType = getQueueType();

                    set((state) => {
                        const uniqueIdMap = new Map(items.map((item) => [item._uniqueId, item]));

                        if (queueType == QueueType.DEFAULT) {
                            // Find the index of the drop target
                            const index = state.queue.default.findIndex(
                                (item) => item._uniqueId === uniqueId,
                            );

                            // Get the new index based on the edge
                            const newIndex = Math.max(0, edge === 'top' ? index : index + 1);

                            const itemsBefore = state.queue.default
                                .slice(0, newIndex)
                                .filter((item) => !uniqueIdMap.has(item._uniqueId));

                            const itemsAfter = state.queue.default
                                .slice(newIndex)
                                .filter((item) => !uniqueIdMap.has(item._uniqueId));

                            state.queue.default = [...itemsBefore, ...items, ...itemsAfter];
                        } else {
                            const priorityIndex = state.queue.priority.findIndex(
                                (item) => item._uniqueId === uniqueId,
                            );

                            // If the item is in the priority queue
                            if (priorityIndex !== -1) {
                                const newIndex = Math.max(
                                    0,
                                    edge === 'top' ? priorityIndex : priorityIndex + 1,
                                );

                                const itemsBefore = state.queue.priority
                                    .slice(0, newIndex)
                                    .filter((item) => !uniqueIdMap.has(item._uniqueId));

                                const itemsAfter = state.queue.priority
                                    .slice(newIndex)
                                    .filter((item) => !uniqueIdMap.has(item._uniqueId));

                                state.queue.priority = [...itemsBefore, ...items, ...itemsAfter];
                            } else {
                                const defaultIndex = state.queue.default.findIndex(
                                    (item) => item._uniqueId === uniqueId,
                                );

                                if (defaultIndex !== -1) {
                                    const newIndex = Math.max(
                                        0,
                                        edge === 'top' ? defaultIndex : defaultIndex + 1,
                                    );

                                    const itemsBefore = state.queue.default
                                        .slice(0, newIndex)
                                        .filter((item) => !uniqueIdMap.has(item._uniqueId));

                                    const itemsAfter = state.queue.default
                                        .slice(newIndex)
                                        .filter((item) => !uniqueIdMap.has(item._uniqueId));

                                    state.queue.default = [...itemsBefore, ...items, ...itemsAfter];
                                }
                            }
                        }
                    });
                },
                moveSelectedToBottom: (items: PlayQueueItem[]) => {
                    set((state) => {
                        const uniqueIds = items.map((item) => item._uniqueId);
                        const filtered = state.queue.default.filter(
                            (item) => !uniqueIds.includes(item._uniqueId),
                        );

                        state.queue.default = [...filtered, ...items];
                    });
                },
                moveSelectedToNext: (items: PlayQueueItem[]) => {
                    const queueType = getQueueType();

                    set((state) => {
                        const uniqueIds = items.map((item) => item._uniqueId);

                        if (queueType === QueueType.DEFAULT) {
                            const currentIndex = state.player.index;
                            const filtered = state.queue.default.filter(
                                (item) => !uniqueIds.includes(item._uniqueId),
                            );

                            state.queue.default = [
                                ...filtered.slice(0, currentIndex + 1),
                                ...items,
                                ...filtered.slice(currentIndex + 1),
                            ];
                        } else {
                            const currentIndex = state.player.index;
                            const isInPriority = currentIndex < state.queue.priority.length;

                            if (isInPriority) {
                                state.queue.priority = [
                                    ...state.queue.priority.slice(0, currentIndex + 1),
                                    ...items,
                                    ...state.queue.priority.slice(currentIndex + 1),
                                ];
                            } else {
                                state.queue.priority = [...state.queue.priority, ...items];
                            }
                        }
                    });
                },
                moveSelectedToTop: (items: PlayQueueItem[]) => {
                    set((state) => {
                        const uniqueIds = items.map((item) => item._uniqueId);

                        const filtered = state.queue.default.filter(
                            (item) => !uniqueIds.includes(item._uniqueId),
                        );

                        state.queue.default = [...items, ...filtered];
                    });
                },
                player: {
                    index: -1,
                    muted: false,
                    playerNum: 1,
                    repeat: PlayerRepeat.OFF,
                    shuffle: PlayerShuffle.OFF,
                    speed: 1,
                    status: PlayerStatus.PAUSED,
                    timestamp: 0,
                    volume: 1,
                },
                queue: {
                    default: [],
                    priority: [],
                    shuffled: [],
                },
                setVolume: (volume: number) => {
                    set((state) => {
                        state.player.volume = volume;
                    });
                },
                shuffle: () => {
                    set((state) => {
                        state.queue.default = shuffleInPlace(state.queue.default);
                    });
                },
                shuffleSelected: (items: PlayQueueItem[]) => {
                    set((state) => {
                        const indices = items.map((item) =>
                            state.queue.default.findIndex((i) => i._uniqueId === item._uniqueId),
                        );

                        const shuffledItems = shuffleInPlace(items);

                        indices.forEach((i, index) => {
                            state.queue.default[i] = shuffledItems[index];
                        });
                    });
                },
            })),
        ),
        { name: 'player-store', version: 1 },
    ),
);

export const usePlayerStore = createSelectors(usePlayerStoreBase);

export const usePlayerActions = () => {
    return usePlayerStoreBase(
        useShallow((state) => ({
            addToQueueByType: state.addToQueueByType,
            addToQueueByUniqueId: state.addToQueueByUniqueId,
            clearQueue: state.clearQueue,
            clearSelected: state.clearSelected,
            decreaseVolume: state.decreaseVolume,
            getQueue: state.getQueue,
            increaseVolume: state.increaseVolume,
            mediaNext: state.mediaNext,
            mediaPause: state.mediaPause,
            mediaPlay: state.mediaPlay,
            mediaPrevious: state.mediaPrevious,
            mediaStepBackward: state.mediaStepBackward,
            mediaStepForward: state.mediaStepForward,
            mediaTogglePlayPause: state.mediaTogglePlayPause,
            moveSelectedTo: state.moveSelectedTo,
            moveSelectedToBottom: state.moveSelectedToBottom,
            moveSelectedToNext: state.moveSelectedToNext,
            moveSelectedToTop: state.moveSelectedToTop,
            setVolume: state.setVolume,
            shuffle: state.shuffle,
            shuffleSelected: state.shuffleSelected,
            // autoNext: state.actions.autoNext,
            // checkIsFirstTrack: state.actions.checkIsFirstTrack,
            // checkIsLastTrack: state.actions.checkIsLastTrack,
            // clearQueue: state.actions.clearQueue,
            // getPlayerData: state.actions.getPlayerData,
            // getQueueData: state.actions.getQueueData,
            // incrementPlayCount: state.actions.incrementPlayCount,
            // next: state.actions.next,
            // pause: state.actions.pause,
            // play: state.actions.play,
            // player1: state.actions.player1,
            // player2: state.actions.player2,
            // previous: state.actions.previous,
        })),
    );
};

export const usePlayerStatus = () => {
    return usePlayerStore(useShallow((state) => state.player.status));
};

// function shuffleArray<T>(array: T[]): T[] {
//     const newArray = [...array];

//     for (let i = newArray.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//     }

//     return newArray;
// }

export type AddToQueueByUniqueId = {
    edge: 'top' | 'bottom' | 'left' | 'right' | null;
    uniqueId: string;
};

export type AddToQueueByPlayType = PlayType;

export type AddToQueueType = AddToQueueByUniqueId | AddToQueueByPlayType;

export async function addToQueueByFetch(
    queryClient: QueryClient,
    libraryId: string,
    type: AddToQueueType,
    args: {
        id: string[];
        itemType: LibraryItemType;
        params?: GetApiLibraryIdAlbumsIdTracksParams;
    },
) {
    const items: TrackItem[] = [];

    if (args.itemType === LibraryItemType.ALBUM) {
        for (const id of args.id) {
            const result = await fetchTracksByAlbumId(queryClient, libraryId, id, {
                sortBy: TrackListSortOptions.ID,
                sortOrder: ListSortOrder.ASC,
                ...args.params,
            });

            items.push(...result.data);
        }
    }

    if (typeof type === 'string') {
        usePlayerStoreBase.getState().addToQueueByType(items, type);
    } else {
        const normalizedEdge = type.edge === 'top' ? 'top' : 'bottom';
        usePlayerStoreBase.getState().addToQueueByUniqueId(items, type.uniqueId, normalizedEdge);
    }
}

export async function addToQueueByData(type: AddToQueueType, data: TrackItem[]) {
    const items = data.map(toPlayQueueItem);

    if (typeof type === 'string') {
        usePlayerStoreBase.getState().addToQueueByType(items, type);
    } else {
        const normalizedEdge = type.edge === 'top' ? 'top' : 'bottom';
        usePlayerStoreBase.getState().addToQueueByUniqueId(items, type.uniqueId, normalizedEdge);
    }
}

export const subscribePlayerQueue = (
    onChange: (queue: QueueData, prevQueue: QueueData) => void,
) => {
    return usePlayerStoreBase.subscribe(
        (state) => state.queue,
        (queue, prevQueue) => {
            onChange(queue, prevQueue);
        },
    );
};

function toPlayQueueItem(item: TrackItem): PlayQueueItem {
    return {
        ...item,
        _uniqueId: nanoid(),
    };
}

function getQueueType() {
    // eslint-disable-next-line no-constant-condition
    const queueType: QueueType = 1 > 0 ? QueueType.DEFAULT : QueueType.PRIORITY; // TODO: Implement settings store useSettingsStore.getState().queueType
    return queueType;
}
