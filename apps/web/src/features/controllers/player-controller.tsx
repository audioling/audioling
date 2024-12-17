import { useEffect, useRef } from 'react';
import type { LibraryItemType } from '@repo/shared-types';
import { createCallable } from 'react-call';
import { useParams } from 'react-router-dom';
import type { PlayQueueItem, TrackItem } from '@/api/api-types.ts';
import {
    addToQueueByData,
    addToQueueByFetch,
    usePlayerActions,
} from '@/features/player/stores/player-store.tsx';
import type { AddToQueueType } from '@/features/player/stores/player-store.tsx';
import { queryClient } from '@/lib/react-query.ts';

interface PlayerControllerProps {
    cmd: PlayerCommand;
}

export const PlayerController = createCallable<PlayerControllerProps, void>(({ call, cmd }) => {
    const { libraryId } = useParams() as { libraryId: string };
    const {
        mediaPause,
        mediaPlay,
        mediaNext,
        mediaPrevious,
        mediaStepBackward,
        mediaStepForward,
        mediaTogglePlayPause,
        moveSelectedTo,
        moveSelectedToTop,
        moveSelectedToBottom,
        moveSelectedToNext,
        clearQueue,
        clearSelected,
        shuffle,
        shuffleSelected,
        setVolume,
        increaseVolume,
        decreaseVolume,
        mediaSeekToTimestamp,
    } = usePlayerActions();

    const isExecuted = useRef<boolean>(false);

    useEffect(() => {
        if (isExecuted.current) {
            return;
        }

        isExecuted.current = true;

        const action = Object.keys(cmd)[0] as keyof PlayerCommand;

        switch (action) {
            case 'addToQueueByData': {
                const command = cmd as AddToQueueByData;
                addToQueueByData(command.addToQueueByData.type, command.addToQueueByData.data);
                break;
            }

            case 'addToQueueByFetch': {
                const command = cmd as AddToQueueByFetch;

                addToQueueByFetch(
                    queryClient,
                    libraryId,
                    command.addToQueueByFetch.type,
                    command.addToQueueByFetch,
                );

                break;
            }

            case 'clearQueue': {
                clearQueue();
                break;
            }

            case 'clearSelected': {
                const command = cmd as ClearSelected;
                clearSelected(command.clearSelected.items);
                break;
            }

            case 'mediaPause': {
                mediaPause();
                break;
            }

            case 'mediaPlay': {
                mediaPlay();
                break;
            }

            case 'mediaNext': {
                mediaNext();
                break;
            }

            case 'mediaPrevious': {
                mediaPrevious();
                break;
            }

            case 'mediaSeekToTimestamp': {
                const command = cmd as MediaSeekToTimestamp;
                mediaSeekToTimestamp(command.mediaSeekToTimestamp.timestamp);
                break;
            }

            case 'mediaStepBackward': {
                mediaStepBackward();
                break;
            }

            case 'mediaStepForward': {
                mediaStepForward();
                break;
            }

            case 'mediaTogglePlayPause': {
                mediaTogglePlayPause();
                break;
            }

            case 'setVolume': {
                const command = cmd as SetVolume;
                setVolume(command.setVolume.volume);
                break;
            }

            case 'increaseVolume': {
                const command = cmd as IncreaseVolume;
                increaseVolume(command.increaseVolume.amount);
                break;
            }

            case 'decreaseVolume': {
                const command = cmd as DecreaseVolume;
                decreaseVolume(command.decreaseVolume.amount);
                break;
            }

            case 'moveSelectedTo': {
                const command = cmd as MoveSelectedTo;
                moveSelectedTo(
                    command.moveSelectedTo.items,
                    command.moveSelectedTo.uniqueId,
                    command.moveSelectedTo.edge,
                );
                break;
            }

            case 'moveSelectedToTop': {
                const command = cmd as MoveSelectedToTop;
                moveSelectedToTop(command.moveSelectedToTop.items);
                break;
            }

            case 'moveSelectedToBottom': {
                const command = cmd as MoveSelectedToBottom;
                moveSelectedToBottom(command.moveSelectedToBottom.items);
                break;
            }

            case 'moveSelectedToNext': {
                const command = cmd as MoveSelectedToNext;
                moveSelectedToNext(command.moveSelectedToNext.items);
                break;
            }

            case 'shuffle': {
                shuffle();
                break;
            }

            case 'shuffleSelected': {
                const command = cmd as ShuffleSelected;
                shuffleSelected(command.shuffleSelected.items);
                break;
            }
        }

        call.end();
    }, [
        cmd,
        call,
        libraryId,
        mediaNext,
        mediaPause,
        mediaPlay,
        mediaPrevious,
        mediaStepBackward,
        mediaStepForward,
        mediaTogglePlayPause,
        clearQueue,
        clearSelected,
        moveSelectedToTop,
        moveSelectedToBottom,
        moveSelectedToNext,
        shuffle,
        shuffleSelected,
        moveSelectedTo,
        setVolume,
        increaseVolume,
        decreaseVolume,
        mediaSeekToTimestamp,
    ]);

    return null;
});

export type PlayerCommand =
    | AddToQueueByData
    | AddToQueueByFetch
    | ClearQueue
    | ClearSelected
    | MediaPause
    | MediaPlay
    | MediaNext
    | MediaPrevious
    | MediaStepBackward
    | MediaStepForward
    | MediaSeekToTimestamp
    | MediaTogglePlayPause
    | MoveSelectedTo
    | MoveSelectedToTop
    | MoveSelectedToBottom
    | MoveSelectedToNext
    | Shuffle
    | ShuffleSelected
    | SetVolume
    | IncreaseVolume
    | DecreaseVolume;

type SetVolume = {
    setVolume: {
        volume: number;
    };
};

type IncreaseVolume = {
    increaseVolume: {
        amount: number;
    };
};

type DecreaseVolume = {
    decreaseVolume: {
        amount: number;
    };
};

type AddToQueueByFetch = {
    addToQueueByFetch: {
        id: string[];
        itemType: LibraryItemType;
        type: AddToQueueType;
    };
};

type AddToQueueByData = {
    addToQueueByData: {
        data: TrackItem[];
        type: AddToQueueType;
    };
};

type MediaPause = {
    mediaPause: null;
};

type MediaPlay = {
    mediaPlay: null;
};

type MediaNext = {
    mediaNext: null;
};

type MediaPrevious = {
    mediaPrevious: null;
};

type MediaStepBackward = {
    mediaStepBackward: null;
};

type MediaStepForward = {
    mediaStepForward: null;
};

type MediaTogglePlayPause = {
    mediaTogglePlayPause: null;
};

type MediaSeekToTimestamp = {
    mediaSeekToTimestamp: {
        timestamp: number;
    };
};

type ClearQueue = {
    clearQueue: null;
};

type ClearSelected = {
    clearSelected: {
        items: PlayQueueItem[];
    };
};

type MoveSelectedToTop = {
    moveSelectedToTop: {
        items: PlayQueueItem[];
    };
};

type MoveSelectedToBottom = {
    moveSelectedToBottom: {
        items: PlayQueueItem[];
    };
};

type MoveSelectedToNext = {
    moveSelectedToNext: {
        items: PlayQueueItem[];
    };
};

type MoveSelectedTo = {
    moveSelectedTo: {
        edge: 'top' | 'bottom';
        items: PlayQueueItem[];
        uniqueId: string;
    };
};

type Shuffle = {
    shuffle: null;
};

type ShuffleSelected = {
    shuffleSelected: {
        items: PlayQueueItem[];
    };
};
