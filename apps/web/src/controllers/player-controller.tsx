import type { PlayQueueItem, TrackItem } from '/@/app-types';
import type { AddToQueueType } from '/@/stores/player-store';
import type { ServerItemType } from '@repo/shared-types/app-types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { createCallable } from 'react-call';
import { useAppContext } from '/@/features/authentication/context/app-context';
import { addToQueueByData, addToQueueByFetch, usePlayerActions } from '/@/stores/player-store';

interface PlayerControllerProps {
    cmd: PlayerCommand;
}

export const PlayerController = createCallable<PlayerControllerProps, void>(({ call, cmd }) => {
    const queryClient = useQueryClient();

    const { server } = useAppContext();

    const {
        clearQueue,
        clearSelected,
        decreaseVolume,
        increaseVolume,
        mediaNext,
        mediaPause,
        mediaPlay,
        mediaPrevious,
        mediaSeekToTimestamp,
        mediaStepBackward,
        mediaStepForward,
        mediaToggleMute,
        mediaTogglePlayPause,
        moveSelectedTo,
        moveSelectedToBottom,
        moveSelectedToNext,
        moveSelectedToTop,
        setVolume,
        shuffle,
        shuffleAll,
        shuffleSelected,
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
                    server,
                    queryClient,
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
                const command = cmd as MediaPlay;
                mediaPlay(command.mediaPlay?.id);
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

            case 'mediaToggleMute': {
                mediaToggleMute();
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

            case 'shuffleAll': {
                shuffleAll();
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
        queryClient,
        cmd,
        call,
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
        server,
        shuffle,
        shuffleSelected,
        moveSelectedTo,
        setVolume,
        increaseVolume,
        decreaseVolume,
        mediaSeekToTimestamp,
        mediaToggleMute,
        shuffleAll,
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
    | MediaToggleMute
    | MoveSelectedTo
    | MoveSelectedToTop
    | MoveSelectedToBottom
    | MoveSelectedToNext
    | Shuffle
    | ShuffleAll
    | ShuffleSelected
    | SetVolume
    | IncreaseVolume
    | DecreaseVolume;

interface SetVolume {
    setVolume: {
        volume: number;
    };
}

interface IncreaseVolume {
    increaseVolume: {
        amount: number;
    };
}

interface DecreaseVolume {
    decreaseVolume: {
        amount: number;
    };
}

interface AddToQueueByFetch {
    addToQueueByFetch: {
        id: string[];
        itemType: ServerItemType;
        type: AddToQueueType;
    };
}

interface AddToQueueByData {
    addToQueueByData: {
        data: TrackItem[];
        type: AddToQueueType;
    };
}

interface MediaPause {
    mediaPause: null;
}

interface MediaPlay {
    mediaPlay: null | {
        id: string;
    };
}

interface MediaNext {
    mediaNext: null;
}

interface MediaPrevious {
    mediaPrevious: null;
}

interface MediaStepBackward {
    mediaStepBackward: null;
}

interface MediaStepForward {
    mediaStepForward: null;
}

interface MediaTogglePlayPause {
    mediaTogglePlayPause: null;
}

interface MediaSeekToTimestamp {
    mediaSeekToTimestamp: {
        timestamp: number;
    };
}

interface MediaToggleMute {
    mediaToggleMute: null;
}

interface ClearQueue {
    clearQueue: null;
}

interface ClearSelected {
    clearSelected: {
        items: PlayQueueItem[];
    };
}

interface MoveSelectedToTop {
    moveSelectedToTop: {
        items: PlayQueueItem[];
    };
}

interface MoveSelectedToBottom {
    moveSelectedToBottom: {
        items: PlayQueueItem[];
    };
}

interface MoveSelectedToNext {
    moveSelectedToNext: {
        items: PlayQueueItem[];
    };
}

interface MoveSelectedTo {
    moveSelectedTo: {
        edge: 'top' | 'bottom';
        items: PlayQueueItem[];
        uniqueId: string;
    };
}

interface Shuffle {
    shuffle: null;
}

interface ShuffleAll {
    shuffleAll: null;
}

interface ShuffleSelected {
    shuffleSelected: {
        items: PlayQueueItem[];
    };
}
