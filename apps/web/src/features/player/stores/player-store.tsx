import { useCallback } from 'react';
import { LexoRank } from '@dalet-oss/lexorank';
import { ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';
import type { PlayQueueItem, TrackItem } from '@/api/api-types.ts';
import { fetchAlbumTracks } from '@/api/fetchers/album.ts';

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
    LAST = 'last',
    NEXT = 'next',
    NOW = 'now',
}

export interface QueueData {
    currentIndex: number;
    default: PlayQueueItem[];
    next: PlayQueueItem[];
}

// Add new interface for the grouped queue structure
interface GroupedQueue {
    all: PlayQueueItem[];
    current: PlayQueueItem[];
    next: PlayQueueItem[];
    remaining: PlayQueueItem[];
}

interface Actions {
    addToQueueByIndex: (index: number, items: TrackItem[]) => void;
    addToQueueByType: (playType: PlayType, items: TrackItem[]) => void;
    clearQueue: () => void;
    getDefaultQueue: () => PlayQueueItem[];
    getNextQueue: () => PlayQueueItem[];
    getPlayerData: () => PlayerData;
    getQueue: () => GroupedQueue;
    goToNextTrack: () => void;
    goToPreviousTrack: () => void;
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
                    const queue = get().getDefaultQueue();

                    const startRank = LexoRank.parse(queue[index].order);
                    const endRank = LexoRank.parse(queue[index + 1].order);

                    const between = startRank.multipleBetween(endRank, items.length);

                    set((state) => {
                        for (let i = 0; i < items.length; i++) {
                            state.queue.default.push({
                                ...items[i],
                                order: between[i].toString(),
                                uniqueId: nanoid(),
                            });
                        }
                    });
                },
                addToQueueByType: (playType, items) => {
                    switch (playType) {
                        case PlayType.NOW: {
                            set((state) => {
                                state.queue.default = [];
                                state.queue.currentIndex = 0;

                                let rank = LexoRank.middle();
                                for (let i = 0; i < items.length; i++) {
                                    rank = rank.genNext();

                                    state.queue.default.push({
                                        ...items[i],
                                        order: rank.toString(),
                                        uniqueId: nanoid(),
                                    });
                                }
                            });
                            break;
                        }
                        case PlayType.NEXT: {
                            const queue = get().getNextQueue();

                            const lastIndex = queue.length - 1;

                            const startRank =
                                lastIndex === -1
                                    ? LexoRank.middle()
                                    : LexoRank.parse(queue[lastIndex].order);

                            set((state) => {
                                let rank = startRank;
                                for (let i = 0; i < items.length; i++) {
                                    rank = rank.genNext();
                                    state.queue.next.push({
                                        ...items[i],
                                        order: rank.toString(),
                                        uniqueId: nanoid(),
                                    });
                                }
                            });
                            break;
                        }
                        case PlayType.LAST: {
                            const queue = get().getDefaultQueue();

                            const lastIndex = queue.length - 1;

                            set((state) => {
                                let rank = LexoRank.parse(queue[lastIndex].order);
                                for (let i = 0; i < items.length; i++) {
                                    rank = rank.genNext();

                                    state.queue.default.push({
                                        ...items[i],
                                        order: rank.toString(),
                                        uniqueId: nanoid(),
                                    });
                                }
                            });
                            break;
                        }
                    }
                },
                getDefaultQueue: () => {
                    return [...get().queue.default].sort((a, b) => a.order.localeCompare(b.order));
                },
                getNextQueue: () => {
                    return [...get().queue.next].sort((a, b) => a.order.localeCompare(b.order));
                },
                getPlayerData: () => {
                    return get().player;
                },
                getQueue: () => {
                    const defaultQueue = get().getDefaultQueue();
                    const nextQueue = get().getNextQueue();
                    const currentIndex = get().queue.currentIndex;

                    // Handle case where nothing is playing
                    if (currentIndex === -1) {
                        return {
                            all: [...defaultQueue, ...nextQueue],
                            current: [],
                            next: nextQueue,
                            remaining: defaultQueue,
                        };
                    }

                    // Split the default queue into current and remaining
                    const current = defaultQueue.slice(currentIndex, currentIndex + 1);
                    const beforeCurrent = defaultQueue.slice(0, currentIndex);
                    const afterCurrent = defaultQueue.slice(currentIndex + 1);

                    return {
                        all: [...beforeCurrent, ...current, ...nextQueue, ...afterCurrent],
                        current,
                        next: nextQueue,
                        remaining: afterCurrent,
                    };
                },
                player: {
                    index: 0,
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
                    currentIndex: -1,
                    default: [],
                    next: [],
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
            addToQueue: state.addToQueueByType,
            getQueue: state.getQueue,
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

// function toPlayQueueItem(item: TrackItem): PlayQueueItem {
//     return { ...item, uniqueId: nanoid() };
// }

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export const usePlayerAddToQueue = ({ libraryId }: { libraryId: string }) => {
    const queryClient = useQueryClient();
    const { addToQueue } = usePlayerActions();

    const onPlay = useCallback(
        async (id: string, playType: PlayType, onComplete?: () => void) => {
            const result = await fetchAlbumTracks(queryClient, libraryId, id, {
                sortBy: TrackListSortOptions.ID,
                sortOrder: ListSortOrder.ASC,
            });

            addToQueue(playType, result.data);

            onComplete?.();
        },
        [addToQueue, libraryId, queryClient],
    );

    return { onPlay };
};

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
