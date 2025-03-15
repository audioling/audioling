import type { PlayQueueItem } from '/@/app-types';
import type { PlayerStatus, QueueData } from '/@/stores/player-store';
import {
    subscribeCurrentTrack,
    subscribePlayerMute,
    subscribePlayerProgress,
    subscribePlayerQueue,
    subscribePlayerSeekToTimestamp,
    subscribePlayerSpeed,
    subscribePlayerStatus,
    subscribePlayerVolume,
} from '/@/stores/player-store';

export interface PlayerEventsCallbacks {
    onCurrentTrackChange?: (
        track: { index: number; track: PlayQueueItem | undefined },
        prevTrack: { index: number; track: PlayQueueItem | undefined },
    ) => void;
    onPlayerMute?: (muted: boolean, prevMuted: boolean) => void;
    onPlayerProgress?: (timestamp: number, prevTimestamp: number) => void;
    onPlayerQueueChange?: (queue: QueueData, prevQueue: QueueData) => void;
    onPlayerSeek?: (seconds: number, prevSeconds: number) => void;
    onPlayerSeekToTimestamp?: (timestamp: number, prevTimestamp: number) => void;
    onPlayerSpeed?: (speed: number, prevSpeed: number) => void;
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
    if (callbacks.onPlayerSeekToTimestamp) {
        const unsubscribe = subscribePlayerSeekToTimestamp(callbacks.onPlayerSeekToTimestamp);
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

    // Subscribe to mute changes
    if (callbacks.onPlayerMute) {
        const unsubscribe = subscribePlayerMute(callbacks.onPlayerMute);
        unsubscribers.push(unsubscribe);
    }

    // Subscribe to speed changes
    if (callbacks.onPlayerSpeed) {
        const unsubscribe = subscribePlayerSpeed(callbacks.onPlayerSpeed);
        unsubscribers.push(unsubscribe);
    }

    return {
        cleanup: () => {
            unsubscribers.forEach(unsubscribe => unsubscribe());
        },
    };
}
