import type { PlayQueueItem } from '/@/app-types';
import type { PlayerStatus, QueueData } from '/@/stores/player-store';
import { useEffect } from 'react';
import { createPlayerEvents } from '/@/features/player/components/audio-player/listener/player-events';

export interface PlayerEvents {
    onCurrentTrackChange?: (
        track: { index: number; track: PlayQueueItem | undefined },
        prevTrack: { index: number; track: PlayQueueItem | undefined },
    ) => void;
    onPlayerMute?: (muted: boolean, prevMuted: boolean) => void;
    onPlayerProgress?: (timestamp: number, prevTimestamp: number) => void;
    onPlayerQueueChange?: (queue: QueueData, prevQueue: QueueData) => void;
    onPlayerSeekToTimestamp?: (timestamp: number, prevTimestamp: number) => void;
    onPlayerSpeed?: (speed: number, prevSpeed: number) => void;
    onPlayerStatus?: (status: PlayerStatus, prevStatus: PlayerStatus) => void;
    onPlayerVolume?: (volume: number, prevVolume: number) => void;
}

export function usePlayerEvents(callbacks: PlayerEvents, deps: React.DependencyList) {
    useEffect(() => {
        const engine = createPlayerEvents(callbacks);

        return () => {
            engine.cleanup();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps]);
}
