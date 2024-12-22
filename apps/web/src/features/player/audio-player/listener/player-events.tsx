import type { PlayQueueItem } from '@/api/api-types.ts';
import type { PlayerStatus, QueueData } from '@/features/player/stores/player-store.tsx';
import {
    subscribeCurrentTrack,
    subscribePlayerProgress,
    subscribePlayerQueue,
    subscribePlayerSeekToTimestamp,
    subscribePlayerStatus,
    subscribePlayerVolume,
} from '@/features/player/stores/player-store.tsx';

export interface PlayerEventsCallbacks {
    onCurrentTrackChange?: (
        track: { index: number; track: PlayQueueItem | undefined },
        prevTrack: { index: number; track: PlayQueueItem | undefined },
    ) => void;
    onPlayerProgress?: (timestamp: number, prevTimestamp: number) => void;
    onPlayerQueueChange?: (queue: QueueData, prevQueue: QueueData) => void;
    onPlayerSeek?: (timestamp: number, prevTimestamp: number) => void;
    onPlayerStatus?: (status: PlayerStatus, prevStatus: PlayerStatus) => void;
    onPlayerVolume?: (volume: number, prevVolume: number) => void;
}

export interface PlayerEvents {
    cleanup: () => void;
}

export function createPlayerEvents(callbacks: PlayerEventsCallbacks): PlayerEvents {
    const unsubscribers: (() => void)[] = [];

    // Subscribe to current track changes
    if (callbacks.onCurrentTrackChange) {
        const unsubscribe = subscribeCurrentTrack(callbacks.onCurrentTrackChange);
        unsubscribers.push(unsubscribe);
    }

    // Subscribe to player progress
    if (callbacks.onPlayerProgress) {
        const unsubscribe = subscribePlayerProgress(callbacks.onPlayerProgress);
        unsubscribers.push(unsubscribe);
    }

    // Subscribe to queue changes
    if (callbacks.onPlayerQueueChange) {
        const unsubscribe = subscribePlayerQueue(callbacks.onPlayerQueueChange);
        unsubscribers.push(unsubscribe);
    }

    // Subscribe to seek events
    if (callbacks.onPlayerSeek) {
        const unsubscribe = subscribePlayerSeekToTimestamp(callbacks.onPlayerSeek);
        unsubscribers.push(unsubscribe);
    }

    // Subscribe to player status changes
    if (callbacks.onPlayerStatus) {
        const unsubscribe = subscribePlayerStatus(callbacks.onPlayerStatus);
        unsubscribers.push(unsubscribe);
    }

    // Subscribe to volume changes
    if (callbacks.onPlayerVolume) {
        const unsubscribe = subscribePlayerVolume(callbacks.onPlayerVolume);
        unsubscribers.push(unsubscribe);
    }

    return {
        cleanup: () => {
            unsubscribers.forEach((unsubscribe) => unsubscribe());
        },
    };
}
