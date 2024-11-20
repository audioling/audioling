import { useCallback } from 'react';
import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';
import type { PlayQueueItem, TrackItem } from '@/api/api-types.ts';
import { fetchAlbumTracks } from '@/api/fetchers/albums.ts';

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

// Add new interface for the grouped queue structure
interface GroupedQueue {
    all: PlayQueueItem[];
    current: PlayQueueItem[];
    remaining: PlayQueueItem[];
}

type GroupingProperty = keyof PlayQueueItem;

interface Actions {
    addToQueueByIndex: (index: number, items: TrackItem[]) => void;
    addToQueueByType: (playType: PlayType, items: TrackItem[]) => void;
    clearQueue: () => void;
    getDefaultQueue: () => PlayQueueItem[];
    // getPlayerData: () => PlayerData;
    getQueue: (groupBy?: GroupingProperty) => GroupedQueue;
    mediaNext: () => void;
    mediaPause: () => void;
    mediaPlay: () => void;
    mediaPrevious: () => void;
    mediaStepBackward: () => void;
    mediaStepForward: () => void;
    mediaTogglePlayPause: () => void;
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

interface PlayerState extends State, Actions {}

export const usePlayerStore = create<PlayerState>()(
    persist(
        subscribeWithSelector(
            immer((set, get) => ({
                addToQueueByIndex: (index, items) => {
                    set((state) => {
                        const newItems = items.map(toPlayQueueItem);

                        // If we're adding to the end of the queue, just append
                        if (index === state.queue.default.length - 1) {
                            state.queue.default = [...state.queue.default, ...newItems];
                        } else {
                            // Otherwise, insert the new items at the specified index
                            const before = state.queue.default.slice(0, index);
                            const after = state.queue.default.slice(index);
                            state.queue.default = [...before, ...newItems, ...after];
                        }
                    });
                },
                addToQueueByType: (playType, items) => {
                    const newItems = items.map(toPlayQueueItem);

                    switch (playType) {
                        case PlayType.NOW: {
                            set((state) => {
                                state.queue.default = [];
                                state.player.index = 0;
                                state.queue.default = [...newItems];
                            });
                            break;
                        }
                        case PlayType.NEXT: {
                            set((state) => {
                                const currentIndex = state.player.index;
                                const before = state.queue.default.slice(0, currentIndex + 1);
                                const after = state.queue.default.slice(currentIndex + 1);
                                state.queue.default = [...before, ...newItems, ...after];
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
                },
                clearQueue: () => {
                    set((state) => {
                        state.queue.default = [];
                    });
                },
                getDefaultQueue: () => {
                    return get().queue.default;
                },
                getQueue: (groupBy?: GroupingProperty) => {
                    const defaultQueue = get().getDefaultQueue();
                    const currentIndex = get().player.index;

                    // Helper function to determine if an item is a group header
                    const isGroupHeader = (
                        item: PlayQueueItem,
                        index: number,
                        array: PlayQueueItem[],
                    ) => {
                        if (!groupBy) return false;
                        if (index === 0) return true;

                        const prevItem = array[index - 1];
                        return item[groupBy] !== prevItem[groupBy];
                    };

                    // Add isGroupHeader property to items
                    const processItems = (items: PlayQueueItem[]): PlayQueueItem[] => {
                        return items.map((item, index, array) => ({
                            ...item,
                            _group: groupBy ? (item[groupBy] as string) : '',
                            _isGroupHeader: isGroupHeader(item, index, array),
                        }));
                    };

                    // Handle case where nothing is playing
                    if (currentIndex === -1) {
                        const processedQueue = processItems(defaultQueue);
                        return {
                            all: processedQueue,
                            current: [],
                            remaining: processedQueue,
                        };
                    }

                    // Split the default queue into current and remaining
                    const beforeCurrent = defaultQueue.slice(0, currentIndex);
                    const current = defaultQueue.slice(currentIndex, currentIndex + 1);
                    const afterCurrent = defaultQueue.slice(currentIndex + 1);

                    // Process each section with the grouping logic
                    return {
                        all: processItems([...beforeCurrent, ...current, ...afterCurrent]),
                        current: processItems(current),
                        remaining: processItems(afterCurrent),
                    };
                },
                mediaNext: () => {
                    const currentIndex = get().player.index;
                    const defaultQueue = get().getDefaultQueue();

                    set((state) => {
                        state.player.index = Math.min(defaultQueue.length - 1, currentIndex + 1);
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
                },
            })),
        ),
        { name: 'player-store', version: 1 },
    ),
);

export const usePlayerState = () => {
    return usePlayerStore(
        useShallow((state) => ({
            player: state.player,
            queue: state.queue,
        })),
    );
};

export const usePlayerActions = () => {
    return usePlayerStore(
        useShallow((state) => ({
            addToQueueByIndex: state.addToQueueByIndex,
            addToQueueByType: state.addToQueueByType,
            clearQueue: state.clearQueue,
            getQueue: state.getQueue,
            mediaNext: state.mediaNext,
            mediaPause: state.mediaPause,
            mediaPlay: state.mediaPlay,
            mediaPrevious: state.mediaPrevious,
            mediaStepBackward: state.mediaStepBackward,
            mediaStepForward: state.mediaStepForward,
            mediaTogglePlayPause: state.mediaTogglePlayPause,
            // autoNext: state.actions.autoNext,
            // checkIsFirstTrack: state.actions.checkIsFirstTrack,
            // checkIsLastTrack: state.actions.checkIsLastTrack,
            // clearQueue: state.actions.clearQueue,
            // getPlayerData: state.actions.getPlayerData,
            // getQueueData: state.actions.getQueueData,
            // incrementPlayCount: state.actions.incrementPlayCount,
            // moveToBottomOfQueue: state.actions.moveToBottomOfQueue,
            // moveToNextOfQueue: state.actions.moveToNextOfQueue,
            // moveToTopOfQueue: state.actions.moveToTopOfQueue,
            // next: state.actions.next,
            // pause: state.actions.pause,
            // play: state.actions.play,
            // player1: state.actions.player1,
            // player2: state.actions.player2,
            // previous: state.actions.previous,
            // removeFromQueue: state.actions.removeFromQueue,
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
        id: string;
        itemType: LibraryItemType;
        params?: GetApiLibraryIdAlbumsIdTracksParams;
    },
) {
            let items: TrackItem[] = [];

            if (args.itemType === LibraryItemType.ALBUM) {
        const result = await fetchTracksByAlbumId(queryClient, libraryId, args.id, {
                    sortBy: TrackListSortOptions.ID,
                    sortOrder: ListSortOrder.ASC,
            ...args.params,
                });

                items = result.data;
            }

    if (typeof type === 'string') {
        usePlayerStore.getState().addToQueueByType(type, items);
            } else {
        const normalizedEdge = type.edge === 'top' ? 'top' : 'bottom';
        usePlayerStore.getState().addToQueueByUniqueId(type.uniqueId, items, normalizedEdge);
    }
}

export async function addToQueueByData(type: AddToQueueType, data: TrackItem[]) {
    const items = data.map(toPlayQueueItem);

    if (typeof type === 'string') {
        usePlayerStore.getState().addToQueueByType(type, items);
    } else {
        const normalizedEdge = type.edge === 'top' ? 'top' : 'bottom';
        usePlayerStore.getState().addToQueueByUniqueId(type.uniqueId, items, normalizedEdge);
    }
}

export const subscribePlayerQueue = (
    onChange: (queue: QueueData, prevQueue: QueueData) => void,
) => {
    return usePlayerStore.subscribe(
        (state) => state.queue,
        (queue, prevQueue) => {
            onChange(queue, prevQueue);
        },
    );
};

function toPlayQueueItem(item: TrackItem): PlayQueueItem {
    return {
        ...item,
        _queueId: nanoid(),
        _uniqueId: nanoid(),
    };
}
