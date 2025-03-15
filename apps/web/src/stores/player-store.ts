import type { PlayQueueItem, TrackItem } from '/@/app-types';
import type { AdapterAlbumTrackListRequest } from '@repo/shared-types/adapter-types';
import type { AuthServer } from '@repo/shared-types/app-types';
import type { QueryClient } from '@tanstack/react-query';
import { ListSortOrder, ServerItemType, TrackListSortOptions } from '@repo/shared-types/app-types';
import merge from 'lodash/merge';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';
import { queryAlbumArtistTrackList } from '/@/features/album-artists/api/get-album-artist-track-list';
import { queryAlbumTrackList } from '/@/features/albums/api/get-album-track-list';
import { queryGenreTrackList } from '/@/features/genres/api/get-genre-track-list';
import { queryPlaylistTrackList } from '/@/features/playlists/api/get-playlist-track-list';
import { createSelectors } from '/@/lib/zustand';
import { shuffleInPlace } from '/@/utils/shuffle';

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

export enum PlayerTransition {
    CROSSFADE = 'crossfade',
    GAPLESS = 'gapless',
}

export enum PlayerShuffle {
    OFF = 'off',
    TRACK = 'track',
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
    shuffled: string[];
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
    getCurrentTrack: () => PlayQueueItem | undefined;
    getQueue: (groupBy?: QueueGroupingProperty) => GroupedQueue;
    getQueueOrder: () => {
        groups: { count: number; name: string }[];
        items: PlayQueueItem[];
    };
    increaseVolume: (value: number) => void;
    mediaAutoNext: () => PlayerData;
    mediaNext: () => void;
    mediaPause: () => void;
    mediaPlay: (id?: string) => void;
    mediaPrevious: () => void;
    mediaSeekToTimestamp: (timestamp: number) => void;
    mediaStepBackward: () => void;
    mediaStepForward: () => void;
    mediaToggleMute: () => void;
    mediaTogglePlayPause: () => void;
    moveSelectedTo: (items: PlayQueueItem[], uniqueId: string, edge: 'top' | 'bottom') => void;
    moveSelectedToBottom: (items: PlayQueueItem[]) => void;
    moveSelectedToNext: (items: PlayQueueItem[]) => void;
    moveSelectedToTop: (items: PlayQueueItem[]) => void;
    setCrossfadeDuration: (duration: number) => void;
    setProgress: (timestamp: number) => void;
    setQueueType: (queueType: QueueType) => void;
    setRepeat: (repeat: PlayerRepeat) => void;
    setShuffle: (shuffle: PlayerShuffle) => void;
    setSpeed: (speed: number) => void;
    setTransitionType: (transitionType: PlayerTransition) => void;
    setVolume: (volume: number) => void;
    shuffle: () => void;
    shuffleAll: () => void;
    shuffleSelected: (items: PlayQueueItem[]) => void;
}

interface State {
    player: {
        crossfadeDuration: number;
        index: number;
        muted: boolean;
        playerNum: 1 | 2;
        queueType: QueueType;
        repeat: PlayerRepeat;
        seekToTimestamp: string;
        shuffle: PlayerShuffle;
        speed: number;
        status: PlayerStatus;
        stepBackward: number;
        stepForward: number;
        timestamp: number;
        transitionType: PlayerTransition;
        volume: number;
    };
    queue: QueueData;
}

export interface PlayerData {
    currentTrack: PlayQueueItem | undefined;
    nextTrack: PlayQueueItem | undefined;
    player: {
        index: number;
        muted: boolean;
        playerNum: 1 | 2;
        repeat: PlayerRepeat;
        shuffle: PlayerShuffle;
        speed: number;
        status: PlayerStatus;
        transitionType: PlayerTransition;
        volume: number;
    };
    player1: PlayQueueItem | undefined;
    player2: PlayQueueItem | undefined;
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
                                        state.player.status = PlayerStatus.PLAYING;
                                        state.player.playerNum = 1;
                                        state.queue.default = newItems;

                                        if (state.player.shuffle === PlayerShuffle.TRACK) {
                                            state.queue.shuffled = shuffleInPlace(
                                                newItems.map(item => item._uniqueId),
                                            );
                                        }
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

                                        if (state.player.shuffle === PlayerShuffle.TRACK) {
                                            state.queue.shuffled = [
                                                ...state.queue.shuffled.slice(0, currentIndex),
                                                state.queue.shuffled[currentIndex],
                                                ...shuffleInPlace([
                                                    ...state.queue.shuffled.slice(currentIndex + 1),
                                                    ...newItems.map(item => item._uniqueId),
                                                ]),
                                            ];
                                        }
                                    });
                                    break;
                                }
                                case PlayType.LAST: {
                                    set((state) => {
                                        const currentIndex = state.player.index;

                                        state.queue.default = [...state.queue.default, ...newItems];

                                        if (state.player.shuffle === PlayerShuffle.TRACK) {
                                            state.queue.shuffled = [
                                                ...state.queue.shuffled.slice(0, currentIndex),
                                                state.queue.shuffled[currentIndex],
                                                ...shuffleInPlace([
                                                    ...state.queue.shuffled.slice(currentIndex + 1),
                                                    ...newItems.map(item => item._uniqueId),
                                                ]),
                                            ];
                                        }
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
                                        state.player.status = PlayerStatus.PLAYING;
                                        state.player.playerNum = 1;

                                        // Add the first item after the current playing track

                                        const currentIndex = state.player.index;

                                        const queue = state.getQueue();
                                        const currentTrack = queue.items[currentIndex];

                                        if (queue.items.length === 0) {
                                            state.queue.priority = [...newItems.slice(0, 1)];
                                            state.queue.default = [...newItems.slice(1)];
                                            state.player.index = 0;
                                        }
                                        else if (currentTrack) {
                                            const priorityIndex = state.queue.priority.findIndex(
                                                item => item._uniqueId === currentTrack._uniqueId,
                                            );

                                            // If the current track is in the priority queue, add the first item after the current track
                                            if (priorityIndex !== -1) {
                                                state.queue.priority = [
                                                    ...state.queue.priority.slice(
                                                        0,
                                                        priorityIndex + 1,
                                                    ),
                                                    ...newItems.slice(0, 1),
                                                    ...state.queue.priority.slice(
                                                        priorityIndex + 1,
                                                    ),
                                                ];

                                                state.player.index = priorityIndex + 1;

                                                state.queue.default = [
                                                    ...state.queue.default,
                                                    ...newItems.slice(1),
                                                ];
                                            }
                                            else {
                                                // If the current track is not in the priority queue, add it to the end of the priority queue
                                                state.queue.priority = [
                                                    ...state.queue.priority.slice(0, currentIndex),
                                                    ...newItems.slice(0, 1),
                                                    ...state.queue.priority.slice(currentIndex),
                                                ];

                                                state.queue.default = [
                                                    ...state.queue.default,
                                                    ...newItems.slice(1),
                                                ];

                                                state.player.index
                                                    = state.queue.priority.length - 1;
                                            }
                                        }

                                        if (state.player.shuffle === PlayerShuffle.TRACK) {
                                            state.queue.shuffled = shuffleInPlace(
                                                newItems.map(item => item._uniqueId),
                                            );
                                        }
                                    });
                                    break;
                                }
                                case PlayType.NEXT: {
                                    set((state) => {
                                        const currentIndex = state.player.index;
                                        const isInPriority
                                            = currentIndex < state.queue.priority.length;

                                        if (isInPriority) {
                                            state.queue.priority = [
                                                ...state.queue.priority.slice(0, currentIndex + 1),
                                                ...newItems,
                                                ...state.queue.priority.slice(currentIndex + 1),
                                            ];
                                        }
                                        else {
                                            state.queue.priority = [
                                                ...state.queue.priority,
                                                ...newItems,
                                            ];
                                        }

                                        state.queue.shuffled = [
                                            ...state.queue.shuffled.slice(0, currentIndex),
                                            state.queue.shuffled[currentIndex],
                                            ...shuffleInPlace([
                                                ...state.queue.shuffled.slice(currentIndex + 1),
                                                ...newItems.map(item => item._uniqueId),
                                            ]),
                                        ];
                                    });
                                    break;
                                }
                                case PlayType.LAST: {
                                    set((state) => {
                                        state.queue.priority = [
                                            ...state.queue.priority,
                                            ...newItems,
                                        ];

                                        state.queue.shuffled = [
                                            ...state.queue.shuffled,
                                            ...newItems.map(item => item._uniqueId),
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
                                item => item._uniqueId === uniqueId,
                            );

                            const insertIndex = Math.max(0, edge === 'top' ? index : index + 1);

                            // Recalculate the player index if we're inserting items above the current index
                            if (insertIndex <= state.player.index) {
                                state.player.index = state.player.index + newItems.length;
                            }

                            const newQueue = [
                                ...state.queue.default.slice(0, insertIndex),
                                ...newItems,
                                ...state.queue.default.slice(insertIndex),
                            ];

                            recalculatePlayerIndex(state, newQueue);

                            state.queue.default = newQueue;
                        }
                        else {
                            const priorityIndex = state.queue.priority.findIndex(
                                item => item._uniqueId === uniqueId,
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
                            }
                            else {
                                const defaultIndex = state.queue.default.findIndex(
                                    item => item._uniqueId === uniqueId,
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

                            if (state.player.shuffle === PlayerShuffle.TRACK) {
                                const currentIndex = state.player.index;

                                state.queue.shuffled = [
                                    ...state.queue.shuffled.slice(0, currentIndex),
                                    state.queue.shuffled[currentIndex],
                                    ...shuffleInPlace([
                                        ...state.queue.shuffled.slice(currentIndex + 1),
                                        ...newItems.map(item => item._uniqueId),
                                    ]),
                                ];
                            }
                        }
                    });
                },
                clearQueue: () => {
                    set((state) => {
                        state.player.index = -1;
                        state.queue.default = [];
                        state.queue.priority = [];
                    });
                },
                clearSelected: (items: PlayQueueItem[]) => {
                    set((state) => {
                        const uniqueIds = items.map(item => item._uniqueId);

                        state.queue.default = state.queue.default.filter(
                            item => !uniqueIds.includes(item._uniqueId),
                        );

                        state.queue.priority = state.queue.priority.filter(
                            item => !uniqueIds.includes(item._uniqueId),
                        );

                        const newQueue = [...state.queue.priority, ...state.queue.default];

                        recalculatePlayerIndex(state, newQueue);
                    });
                },
                decreaseVolume: (value: number) => {
                    set((state) => {
                        state.player.volume = Math.max(0, state.player.volume - value);
                    });
                },
                getCurrentTrack: () => {
                    const queue = get().getQueue();
                    return queue.items[get().player.index];
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
                        }
                        else {
                            // Find the last occurrence of this group value
                            const lastIndex = [...groups]
                                .reverse()
                                .findIndex(g => g.name === groupValue);
                            if (lastIndex === -1)
                                return;

                            // If the previous group is different, create a new group
                            const previousGroup = groups[groups.length - 1];
                            if (previousGroup.name !== groupValue) {
                                groups.push({ count: 1, name: groupValue });
                            }
                            else {
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
                mediaAutoNext: () => {
                    const currentIndex = get().player.index;
                    const player = get().player;
                    const repeat = player.repeat;
                    const queue = get().getQueueOrder();

                    const newPlayerNum = player.playerNum === 1 ? 2 : 1;
                    let newIndex = Math.min(queue.items.length - 1, currentIndex + 1);
                    let newStatus = PlayerStatus.PLAYING;

                    if (repeat === PlayerRepeat.ONE) {
                        newIndex = currentIndex;
                    }

                    if (newIndex === queue.items.length - 1) {
                        newStatus = PlayerStatus.PAUSED;
                    }

                    set((state) => {
                        state.player.index = newIndex;
                        state.player.playerNum = newPlayerNum;
                        state.player.timestamp = 0;
                        state.player.status = newStatus;
                    });

                    return {
                        currentTrack: queue.items[newIndex],
                        nextTrack: queue.items[newIndex + 1],
                        player: {
                            index: newIndex,
                            muted: player.muted,
                            playerNum: newPlayerNum,
                            repeat: player.repeat,
                            shuffle: player.shuffle,
                            speed: player.speed,
                            status: newStatus,
                            transitionType: player.transitionType,
                            volume: player.volume,
                        },
                        player1:
                            newPlayerNum === 1 ? queue.items[newIndex] : queue.items[newIndex + 1],
                        player2:
                            newPlayerNum === 2 ? queue.items[newIndex] : queue.items[newIndex + 1],
                        queue: get().queue,
                    };
                },
                mediaNext: () => {
                    const currentIndex = get().player.index;
                    const queue = get().getQueueOrder();

                    set((state) => {
                        state.player.index = Math.min(queue.items.length - 1, currentIndex + 1);
                        state.player.playerNum = 1;
                    });
                },
                mediaPause: () => {
                    set((state) => {
                        state.player.status = PlayerStatus.PAUSED;
                    });
                },
                mediaPlay: (id?: string) => {
                    set((state) => {
                        if (id) {
                            const queue = state.getQueue();

                            const index = queue.items.findIndex(item => item._uniqueId === id);

                            if (index !== -1) {
                                state.player.index = index;
                            }
                        }

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
                mediaSeekToTimestamp: (timestamp: number) => {
                    set((state) => {
                        state.player.seekToTimestamp = uniqueSeekToTimestamp(timestamp);
                    });
                },
                mediaStepBackward: () => {
                    set((state) => {
                        const newTimestamp = Math.max(
                            0,
                            state.player.timestamp - state.player.stepBackward,
                        );

                        state.player.seekToTimestamp = uniqueSeekToTimestamp(newTimestamp);
                    });
                },
                mediaStepForward: () => {
                    set((state) => {
                        const queue = state.getQueue();
                        const index = state.player.index;
                        const currentTrack = queue.items[index];
                        const duration = currentTrack?.duration;

                        if (!duration) {
                            return;
                        }

                        const newTimestamp = Math.min(
                            duration - 1,
                            state.player.timestamp + state.player.stepForward,
                        );

                        state.player.seekToTimestamp = uniqueSeekToTimestamp(newTimestamp);
                    });
                },
                mediaToggleMute: () => {
                    set((state) => {
                        state.player.muted = !state.player.muted;
                    });
                },
                mediaTogglePlayPause: () => {
                    set((state) => {
                        if (state.player.status === PlayerStatus.PLAYING) {
                            state.mediaPause();
                        }
                        else {
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
                        const uniqueIdMap = new Map(items.map(item => [item._uniqueId, item]));

                        if (queueType === QueueType.DEFAULT) {
                            // Find the index of the drop target
                            const index = state.queue.default.findIndex(
                                item => item._uniqueId === uniqueId,
                            );

                            // Get the new index based on the edge
                            const insertIndex = Math.max(0, edge === 'top' ? index : index + 1);

                            const itemsBefore = state.queue.default
                                .slice(0, insertIndex)
                                .filter(item => !uniqueIdMap.has(item._uniqueId));

                            const itemsAfter = state.queue.default
                                .slice(insertIndex)
                                .filter(item => !uniqueIdMap.has(item._uniqueId));

                            const newQueue = [...itemsBefore, ...items, ...itemsAfter];

                            recalculatePlayerIndex(state, newQueue);
                            state.queue.default = newQueue;
                        }
                        else {
                            const priorityIndex = state.queue.priority.findIndex(
                                item => item._uniqueId === uniqueId,
                            );

                            // If the item is in the priority queue
                            if (priorityIndex !== -1) {
                                const newIndex = Math.max(
                                    0,
                                    edge === 'top' ? priorityIndex : priorityIndex + 1,
                                );

                                const itemsBefore = state.queue.priority
                                    .slice(0, newIndex)
                                    .filter(item => !uniqueIdMap.has(item._uniqueId));

                                const itemsAfter = state.queue.priority
                                    .slice(newIndex)
                                    .filter(item => !uniqueIdMap.has(item._uniqueId));

                                const newPriorityQueue = [...itemsBefore, ...items, ...itemsAfter];

                                const newDefaultQueue = state.queue.default.filter(
                                    item => !uniqueIdMap.has(item._uniqueId),
                                );

                                recalculatePlayerIndex(state, newPriorityQueue);

                                state.queue.priority = newPriorityQueue;
                                state.queue.default = newDefaultQueue;
                            }
                            else {
                                const defaultIndex = state.queue.default.findIndex(
                                    item => item._uniqueId === uniqueId,
                                );

                                if (defaultIndex !== -1) {
                                    const newIndex = Math.max(
                                        0,
                                        edge === 'top' ? defaultIndex : defaultIndex + 1,
                                    );

                                    const itemsBefore = state.queue.default
                                        .slice(0, newIndex)
                                        .filter(item => !uniqueIdMap.has(item._uniqueId));

                                    const itemsAfter = state.queue.default
                                        .slice(newIndex)
                                        .filter(item => !uniqueIdMap.has(item._uniqueId));

                                    const newDefaultQueue = [
                                        ...itemsBefore,
                                        ...items,
                                        ...itemsAfter,
                                    ];

                                    const newPriorityQueue = state.queue.priority.filter(
                                        item => !uniqueIdMap.has(item._uniqueId),
                                    );

                                    recalculatePlayerIndex(state, newDefaultQueue);

                                    state.queue.default = newDefaultQueue;
                                    state.queue.priority = newPriorityQueue;
                                }
                            }
                        }
                    });
                },
                moveSelectedToBottom: (items: PlayQueueItem[]) => {
                    set((state) => {
                        const uniqueIds = items.map(item => item._uniqueId);

                        if (state.player.queueType === QueueType.PRIORITY) {
                            const priorityFiltered = state.queue.priority.filter(
                                item => !uniqueIds.includes(item._uniqueId),
                            );

                            const newPriorityQueue = [...priorityFiltered, ...items];

                            const filtered = state.queue.default.filter(
                                item => !uniqueIds.includes(item._uniqueId),
                            );

                            const newDefaultQueue = [...filtered];

                            recalculatePlayerIndex(state, newPriorityQueue);

                            state.queue.default = newDefaultQueue;
                            state.queue.priority = newPriorityQueue;
                        }
                        else {
                            const filtered = state.queue.default.filter(
                                item => !uniqueIds.includes(item._uniqueId),
                            );

                            const newQueue = [...filtered, ...items];

                            recalculatePlayerIndex(state, newQueue);

                            state.queue.default = newQueue;
                        }
                    });
                },
                moveSelectedToNext: (items: PlayQueueItem[]) => {
                    const queueType = getQueueType();

                    set((state) => {
                        const queue = state.getQueue();
                        const index = state.player.index;
                        const currentTrack = queue.items[index];
                        const uniqueId = currentTrack?._uniqueId;

                        const uniqueIds = items.map(item => item._uniqueId);

                        if (queueType === QueueType.DEFAULT) {
                            const currentIndex = state.player.index;
                            const filtered = state.queue.default.filter(
                                item => !uniqueIds.includes(item._uniqueId),
                            );

                            const newQueue = [
                                ...filtered.slice(0, currentIndex + 1),
                                ...items,
                                ...filtered.slice(currentIndex + 1),
                            ];

                            recalculatePlayerIndex(state, newQueue);
                            state.queue.default = newQueue;
                        }
                        else {
                            const priorityIndex = state.queue.priority.findIndex(
                                item => item._uniqueId === uniqueId,
                            );

                            const uniqueIdMap = new Map(
                                items.map(item => [item._uniqueId, item]),
                            );

                            // If the item is in the priority queue
                            if (priorityIndex !== -1) {
                                const newIndex = Math.max(0, priorityIndex + 1);

                                const itemsBefore = state.queue.priority
                                    .slice(0, newIndex)
                                    .filter(item => !uniqueIdMap.has(item._uniqueId));

                                const itemsAfter = state.queue.priority
                                    .slice(newIndex)
                                    .filter(item => !uniqueIdMap.has(item._uniqueId));

                                const newPriorityQueue = [...itemsBefore, ...items, ...itemsAfter];

                                const newDefaultQueue = state.queue.default.filter(
                                    item => !uniqueIdMap.has(item._uniqueId),
                                );

                                recalculatePlayerIndex(state, newPriorityQueue);

                                state.queue.priority = newPriorityQueue;
                                state.queue.default = newDefaultQueue;
                            }
                            else {
                                const defaultIndex = state.queue.default.findIndex(
                                    item => item._uniqueId === uniqueId,
                                );

                                if (defaultIndex !== -1) {
                                    const newIndex = Math.max(0, defaultIndex + 1);

                                    const itemsBefore = state.queue.default
                                        .slice(0, newIndex)
                                        .filter(item => !uniqueIdMap.has(item._uniqueId));

                                    const itemsAfter = state.queue.default
                                        .slice(newIndex)
                                        .filter(item => !uniqueIdMap.has(item._uniqueId));

                                    const newDefaultQueue = [
                                        ...itemsBefore,
                                        ...items,
                                        ...itemsAfter,
                                    ];

                                    const newPriorityQueue = state.queue.priority.filter(
                                        item => !uniqueIdMap.has(item._uniqueId),
                                    );

                                    recalculatePlayerIndex(state, newDefaultQueue);

                                    state.queue.default = newDefaultQueue;
                                    state.queue.priority = newPriorityQueue;
                                }
                            }
                        }
                    });
                },
                moveSelectedToTop: (items: PlayQueueItem[]) => {
                    set((state) => {
                        const uniqueIds = items.map(item => item._uniqueId);

                        if (state.player.queueType === QueueType.PRIORITY) {
                            const priorityFiltered = state.queue.priority.filter(
                                item => !uniqueIds.includes(item._uniqueId),
                            );

                            const newPriorityQueue = [...items, ...priorityFiltered];

                            const filtered = state.queue.default.filter(
                                item => !uniqueIds.includes(item._uniqueId),
                            );

                            const newDefaultQueue = [...filtered];

                            recalculatePlayerIndex(state, newPriorityQueue);

                            state.queue.default = newDefaultQueue;
                            state.queue.priority = newPriorityQueue;
                        }
                        else {
                            const filtered = state.queue.default.filter(
                                item => !uniqueIds.includes(item._uniqueId),
                            );

                            const newQueue = [...items, ...filtered];

                            recalculatePlayerIndex(state, newQueue);

                            state.queue.default = newQueue;
                        }
                    });
                },
                player: {
                    crossfadeDuration: 5,
                    index: -1,
                    muted: false,
                    playerNum: 1,
                    queueType: QueueType.DEFAULT,
                    repeat: PlayerRepeat.OFF,
                    seekToTimestamp: uniqueSeekToTimestamp(0),
                    shuffle: PlayerShuffle.OFF,
                    speed: 1,
                    status: PlayerStatus.PAUSED,
                    stepBackward: 10,
                    stepForward: 10,
                    timestamp: 0,
                    transitionType: PlayerTransition.GAPLESS,
                    volume: 30,
                },
                queue: {
                    default: [],
                    priority: [],
                    shuffled: [],
                },
                setCrossfadeDuration: (duration: number) => {
                    set((state) => {
                        const normalizedDuration = Math.max(0, Math.min(10, duration));
                        state.player.crossfadeDuration = normalizedDuration;
                    });
                },
                setProgress: (timestamp: number) => {
                    set((state) => {
                        state.player.timestamp = timestamp;
                    });
                },
                setQueueType: (queueType: QueueType) => {
                    set((state) => {
                        // From default -> priority, move all items from default to priority
                        if (queueType === QueueType.PRIORITY) {
                            state.queue.priority = [
                                ...state.queue.default,
                                ...state.queue.priority,
                            ];
                            state.queue.default = [];
                        }
                        else {
                            // From priority -> default, move all items from priority to the start of default
                            state.queue.default = [...state.queue.priority, ...state.queue.default];
                            state.queue.priority = [];
                        }

                        state.player.queueType = queueType;
                    });
                },
                setRepeat: (repeat: PlayerRepeat) => {
                    set((state) => {
                        state.player.repeat = repeat;
                    });
                },
                setShuffle: (shuffle: PlayerShuffle) => {
                    set((state) => {
                        state.player.shuffle = shuffle;
                        const queue = state.queue.default;
                        state.queue.shuffled = shuffleInPlace(queue.map(item => item._uniqueId));
                    });
                },
                setSpeed: (speed: number) => {
                    set((state) => {
                        const normalizedSpeed = Math.max(0.5, Math.min(2, speed));
                        state.player.speed = normalizedSpeed;
                    });
                },
                setTransitionType: (transitionType: PlayerTransition) => {
                    set((state) => {
                        state.player.transitionType = transitionType;
                    });
                },
                setVolume: (volume: number) => {
                    set((state) => {
                        state.player.volume = volume;
                    });
                },
                shuffle: () => {
                    set((state) => {
                        const queue = state.queue.default;
                        state.queue.shuffled = shuffleInPlace(queue.map(item => item._uniqueId));
                    });
                },
                shuffleAll: () => {
                    set((state) => {
                        const queue = state.queue.default;
                        state.queue.default = shuffleInPlace(queue);
                    });
                },
                shuffleSelected: (items: PlayQueueItem[]) => {
                    set((state) => {
                        const indices = items.map(item =>
                            state.queue.default.findIndex(i => i._uniqueId === item._uniqueId),
                        );

                        const shuffledItems = shuffleInPlace(items);

                        indices.forEach((i, index) => {
                            state.queue.default[i] = shuffledItems[index];
                        });
                    });
                },
            })),
        ),
        {
            merge: (persistedState: any, currentState: any) => {
                return merge(currentState, persistedState);
            },
            name: 'player-store',
            // TODO: We need to use an alternative persistence method for the queue since it may not fit localStorage
            partialize: (state) => {
                return Object.fromEntries(
                    Object.entries(state).filter(([key]) => !['queue'].includes(key)),
                );
            },
            version: 1,
        },
    ),
);

export const usePlayerStore = createSelectors(usePlayerStoreBase);

export function usePlayerActions() {
    return usePlayerStoreBase(
        useShallow(state => ({
            addToQueueByType: state.addToQueueByType,
            addToQueueByUniqueId: state.addToQueueByUniqueId,
            clearQueue: state.clearQueue,
            clearSelected: state.clearSelected,
            decreaseVolume: state.decreaseVolume,
            getQueue: state.getQueue,
            increaseVolume: state.increaseVolume,
            mediaAutoNext: state.mediaAutoNext,
            mediaNext: state.mediaNext,
            mediaPause: state.mediaPause,
            mediaPlay: state.mediaPlay,
            mediaPrevious: state.mediaPrevious,
            mediaSeekToTimestamp: state.mediaSeekToTimestamp,
            mediaStepBackward: state.mediaStepBackward,
            mediaStepForward: state.mediaStepForward,
            mediaToggleMute: state.mediaToggleMute,
            mediaTogglePlayPause: state.mediaTogglePlayPause,
            moveSelectedTo: state.moveSelectedTo,
            moveSelectedToBottom: state.moveSelectedToBottom,
            moveSelectedToNext: state.moveSelectedToNext,
            moveSelectedToTop: state.moveSelectedToTop,
            setCrossfadeDuration: state.setCrossfadeDuration,
            setProgress: state.setProgress,
            setRepeat: state.setRepeat,
            setShuffle: state.setShuffle,
            setSpeed: state.setSpeed,
            setTransitionType: state.setTransitionType,
            setVolume: state.setVolume,
            shuffle: state.shuffle,
            shuffleAll: state.shuffleAll,
            shuffleSelected: state.shuffleSelected,
        })),
    );
}

export interface AddToQueueByUniqueId {
    edge: 'top' | 'bottom' | 'left' | 'right' | null;
    uniqueId: string;
}

export type AddToQueueByPlayType = PlayType;

export type AddToQueueType = AddToQueueByUniqueId | AddToQueueByPlayType;

export async function addToQueueByFetch(
    server: AuthServer,
    queryClient: QueryClient,
    type: AddToQueueType,
    args: {
        id: string[];
        itemType: ServerItemType;
        params?: AdapterAlbumTrackListRequest;
    },
) {
    const items: TrackItem[] = [];

    if (args.itemType === ServerItemType.ALBUM) {
        for (const id of args.id) {
            const result = await queryAlbumTrackList(queryClient, server, {
                query: {
                    id,
                    limit: -1,
                    offset: 0,
                    sortBy: TrackListSortOptions.ID,
                    sortOrder: ListSortOrder.ASC,
                    ...args.params,
                },
            });

            items.push(...result.items);
        }
    }
    else if (args.itemType === ServerItemType.PLAYLIST) {
        for (const id of args.id) {
            const result = await queryPlaylistTrackList(queryClient, server, {
                query: {
                    id,
                    limit: -1,
                    offset: 0,
                    sortBy: TrackListSortOptions.ID,
                    sortOrder: ListSortOrder.ASC,
                    ...args.params,
                },
            });

            items.push(...result.items);
        }
    }
    else if (args.itemType === ServerItemType.GENRE) {
        for (const id of args.id) {
            const result = await queryGenreTrackList(queryClient, server, {
                query: {
                    id,
                    limit: -1,
                    offset: 0,
                    sortBy: TrackListSortOptions.ID,
                    sortOrder: ListSortOrder.ASC,
                    ...args.params,
                },
            });

            items.push(...result.items);
        }
    }
    else if (
        args.itemType === ServerItemType.ALBUM_ARTIST
        || args.itemType === ServerItemType.ARTIST
    ) {
        for (const id of args.id) {
            const result = await queryAlbumArtistTrackList(queryClient, server, {
                query: {
                    id,
                    limit: -1,
                    offset: 0,
                    sortBy: TrackListSortOptions.ID,
                    sortOrder: ListSortOrder.ASC,
                    ...args.params,
                },
            });

            items.push(...result.items);
        }
    }

    if (typeof type === 'string') {
        usePlayerStoreBase.getState().addToQueueByType(items, type);
    }
    else {
        const normalizedEdge = type.edge === 'top' ? 'top' : 'bottom';
        usePlayerStoreBase.getState().addToQueueByUniqueId(items, type.uniqueId, normalizedEdge);
    }
}

export async function addToQueueByData(type: AddToQueueType, data: TrackItem[]) {
    const items = data.map(toPlayQueueItem);

    if (typeof type === 'string') {
        usePlayerStoreBase.getState().addToQueueByType(items, type);
    }
    else {
        const normalizedEdge = type.edge === 'top' ? 'top' : 'bottom';
        usePlayerStoreBase.getState().addToQueueByUniqueId(items, type.uniqueId, normalizedEdge);
    }
}

export function subscribePlayerQueue(onChange: (queue: QueueData, prevQueue: QueueData) => void) {
    return usePlayerStoreBase.subscribe(
        state => state.queue,
        (queue, prevQueue) => {
            onChange(queue, prevQueue);
        },
    );
}

export function subscribeCurrentTrack(onChange: (
    track: { index: number; track: PlayQueueItem | undefined },
    prevTrack: { index: number; track: PlayQueueItem | undefined },
) => void) {
    return usePlayerStoreBase.subscribe(
        (state) => {
            const queue = state.getQueue();
            const index = state.player.index;
            return { index, track: queue.items[index] };
        },
        (track, prevTrack) => {
            onChange(track, prevTrack);
        },
        {
            equalityFn: (a, b) => {
                return a.track?._uniqueId === b.track?._uniqueId;
            },
        },
    );
}

export function subscribePlayerProgress(onChange: (timestamp: number, prevTimestamp: number) => void) {
    return usePlayerStoreBase.subscribe(
        state => state.player.timestamp,
        (timestamp, prevTimestamp) => {
            onChange(timestamp, prevTimestamp);
        },
    );
}

export function subscribePlayerVolume(onChange: (volume: number, prevVolume: number) => void) {
    return usePlayerStoreBase.subscribe(
        state => state.player.volume,
        (volume, prevVolume) => {
            onChange(volume, prevVolume);
        },
    );
}

export function subscribePlayerStatus(onChange: (status: PlayerStatus, prevStatus: PlayerStatus) => void) {
    return usePlayerStoreBase.subscribe(
        state => state.player.status,
        (status, prevStatus) => {
            onChange(status, prevStatus);
        },
    );
}

export function subscribePlayerSeekToTimestamp(onChange: (timestamp: number, prevTimestamp: number) => void) {
    return usePlayerStoreBase.subscribe(
        state => state.player.seekToTimestamp,
        (timestamp, prevTimestamp) => {
            onChange(
                parseUniqueSeekToTimestamp(timestamp),
                parseUniqueSeekToTimestamp(prevTimestamp),
            );
        },
    );
}

export function subscribePlayerMute(onChange: (muted: boolean, prevMuted: boolean) => void) {
    return usePlayerStoreBase.subscribe(
        state => state.player.muted,
        (muted, prevMuted) => {
            onChange(muted, prevMuted);
        },
    );
}

export function subscribePlayerSpeed(onChange: (speed: number, prevSpeed: number) => void) {
    return usePlayerStoreBase.subscribe(
        state => state.player.speed,
        (speed, prevSpeed) => {
            onChange(speed, prevSpeed);
        },
    );
}

export function usePlayerProperties() {
    return usePlayerStoreBase(
        useShallow(state => ({
            crossfadeDuration: state.player.crossfadeDuration,
            isMuted: state.player.muted,
            playerNum: state.player.playerNum,
            queueType: state.player.queueType,
            repeat: state.player.repeat,
            shuffle: state.player.shuffle,
            speed: state.player.speed,
            status: state.player.status,
            transitionType: state.player.transitionType,
            volume: state.player.volume,
        })),
    );
}

export function useCurrentTrack() {
    return usePlayerStoreBase(
        useShallow((state) => {
            const queue = state.getQueue();
            const index = state.player.index;
            return { index, length: queue.items.length, track: queue.items[index] };
        }),
    );
}

export function usePlayerProgress() {
    return usePlayerStoreBase(state => state.player.timestamp);
}

export function usePlayerDuration() {
    return usePlayerStoreBase((state) => {
        const queue = state.getQueue();
        const index = state.player.index;
        const currentTrack = queue.items[index];
        return currentTrack?.duration;
    });
}

export function usePlayerData(): PlayerData {
    return usePlayerStoreBase(
        useShallow((state) => {
            const queue = state.getQueue();
            const index = state.player.index;
            const currentTrack = queue.items[index];
            const nextTrack = queue.items[index + 1];

            return {
                currentTrack,
                nextTrack,
                player: state.player,
                player1: state.player.playerNum === 1 ? currentTrack : nextTrack,
                player2: state.player.playerNum === 2 ? currentTrack : nextTrack,
                queue: state.queue,
            };
        }),
    );
}

export function updateQueueFavorites(ids: string[], favorite: boolean) {
    const queue = usePlayerStore.getState().queue;

    const defaultQueue = queue.default.map((item) => {
        if (ids.includes(item.id)) {
            return { ...item, userFavorite: favorite };
        }

        return item;
    });

    const priorityQueue = queue.priority.map((item) => {
        if (ids.includes(item.id)) {
            return { ...item, userFavorite: favorite };
        }

        return item;
    });

    usePlayerStoreBase.setState({
        queue: { default: defaultQueue, priority: priorityQueue, shuffled: queue.shuffled },
    });
}

function toPlayQueueItem(item: TrackItem): PlayQueueItem {
    return {
        ...item,
        _uniqueId: nanoid(),
    };
}

function getQueueType() {
    const queueType: QueueType = usePlayerStore.getState().player.queueType;
    return queueType;
}

function recalculatePlayerIndex(state: any, queue: PlayQueueItem[]) {
    const currentTrack = state.getCurrentTrack() as PlayQueueItem | undefined;

    if (!currentTrack) {
        return;
    }

    const index = queue.findIndex(item => item._uniqueId === currentTrack._uniqueId);
    state.player.index = Math.max(0, index);
}

// We need to use a unique id so that the equalityFn can work if attempting to set the same timestamp
function uniqueSeekToTimestamp(timestamp: number) {
    return `${timestamp}-${nanoid()}`;
}

function parseUniqueSeekToTimestamp(timestamp: string) {
    return Number(timestamp.split('-')[0]);
}

export function usePlayerStatus() {
    return usePlayerStoreBase(state => state.player.status);
}

export function usePlayerVolume() {
    return usePlayerStoreBase(state => state.player.volume);
}

export function usePlayerMuted() {
    return usePlayerStoreBase(state => state.player.muted);
}

export function usePlayerShuffle() {
    return usePlayerStoreBase(state => state.player.shuffle);
}

export function usePlayerRepeat() {
    return usePlayerStoreBase(state => state.player.repeat);
}

export function usePlayerQueueType() {
    return usePlayerStoreBase(state => state.player.queueType);
}
