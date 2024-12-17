import type { Dispatch } from 'react';
import { useCallback, useRef, useState } from 'react';
import type ReactPlayer from 'react-player';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { getStreamUrl } from '@/features/player/audio-player/audio-player.tsx';
import type {
    OnProgressProps,
    WebAudioEngineHandle,
} from '@/features/player/audio-player/engine/web-audio-engine.tsx';
import { WebAudioEngine } from '@/features/player/audio-player/engine/web-audio-engine.tsx';
import { usePlayerEvents } from '@/features/player/audio-player/listener/use-player-events.ts';
import {
    PlayerStatus,
    usePlayerActions,
    usePlayerData,
    usePlayerStore,
} from '@/features/player/stores/player-store.tsx';

const FADE_DURATION = 300; // milliseconds
const FADE_INTERVAL = 10; // milliseconds

export function AudiolingWebPlayer() {
    const playerRef = useRef<WebAudioEngineHandle>(null);
    const { player1, player2, player } = usePlayerData();
    const { mediaAutoNext, setProgress } = usePlayerActions();
    const volume = usePlayerStore.use.player().volume;

    const transitionType = 'gapless';

    const [localPlayerStatus, setLocalPlayerStatus] = useState<PlayerStatus>(player.status);

    const fadeAndSetStatus = useCallback(
        async (startVolume: number, endVolume: number, duration: number, status: PlayerStatus) => {
            const steps = duration / FADE_INTERVAL;
            const volumeStep = (endVolume - startVolume) / steps;
            let currentStep = 0;

            const promise = new Promise((resolve) => {
                const interval = setInterval(() => {
                    currentStep++;
                    const newVolume = startVolume + volumeStep * currentStep;

                    playerRef.current?.setVolume(newVolume);

                    if (currentStep >= steps) {
                        clearInterval(interval);
                        resolve(true);
                    }
                }, FADE_INTERVAL);
            });

            if (status === PlayerStatus.PAUSED) {
                await promise;
                setLocalPlayerStatus(status);
            } else if (status === PlayerStatus.PLAYING) {
                setLocalPlayerStatus(status);
                await promise;
            }
        },
        [],
    );

    const onProgressPlayer1 = (e: OnProgressProps) => {
        setProgress(Number(e.playedSeconds.toFixed(0)));

        switch (transitionType) {
            case 'gapless':
                gaplessHandler({
                    currentTime: e.playedSeconds,
                    duration: getDuration(playerRef.current?.player1()),
                    isFlac: false,
                    isTransitioning,
                    nextPlayerRef: playerRef.current?.player2(),
                    setIsTransitioning,
                });
                break;
        }
    };

    const onProgressPlayer2 = (e: OnProgressProps) => {
        setProgress(Number(e.playedSeconds.toFixed(0)));

        switch (transitionType) {
            case 'gapless':
                gaplessHandler({
                    currentTime: e.playedSeconds,
                    duration: getDuration(playerRef.current?.player2()),
                    isFlac: false,
                    isTransitioning,
                    nextPlayerRef: playerRef.current?.player1(),
                    setIsTransitioning,
                });
                break;
        }
    };

    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleOnEndedPlayer1 = () => {
        const promise = new Promise((resolve) => {
            mediaAutoNext();
            resolve(true);
        });

        promise.then(() => {
            playerRef.current?.player1()?.getInternalPlayer().pause();
            setIsTransitioning(false);
        });
    };

    const handleOnEndedPlayer2 = () => {
        const promise = new Promise((resolve) => {
            mediaAutoNext();
            resolve(true);
        });

        promise.then(() => {
            playerRef.current?.player2()?.getInternalPlayer().pause();
            setIsTransitioning(false);
        });
    };

    usePlayerEvents(
        {
            onPlayerSeek: (timestamp) => {
                if (player.playerNum === 1) {
                    playerRef.current?.player1()?.seekTo(timestamp);
                } else {
                    playerRef.current?.player2()?.seekTo(timestamp);
                }
            },
            onPlayerStatus: async (status) => {
                if (status === PlayerStatus.PAUSED) {
                    fadeAndSetStatus(volume, 0, FADE_DURATION, PlayerStatus.PAUSED);
                } else if (status === PlayerStatus.PLAYING) {
                    fadeAndSetStatus(0, volume, FADE_DURATION, PlayerStatus.PLAYING);
                }
            },
            onPlayerVolume: (volume) => {
                if (player.playerNum === 1) {
                    playerRef.current?.setVolume(volume);
                } else {
                    playerRef.current?.setVolume(volume);
                }
            },
        },
        [volume, player.playerNum],
    );

    const baseUrl = useAuthBaseUrl();
    const player1StreamUrl = player1 ? getStreamUrl(player1.streamUrl, baseUrl) : undefined;
    const player2StreamUrl = player2 ? getStreamUrl(player2.streamUrl, baseUrl) : undefined;

    return (
        <WebAudioEngine
            isMuted={false}
            isTransitioning={isTransitioning}
            playerNum={player.playerNum}
            playerRef={playerRef}
            playerStatus={localPlayerStatus}
            src1={player1StreamUrl}
            src2={player2StreamUrl}
            volume={volume}
            onEndedPlayer1={handleOnEndedPlayer1}
            onEndedPlayer2={handleOnEndedPlayer2}
            onProgressPlayer1={onProgressPlayer1}
            onProgressPlayer2={onProgressPlayer2}
        />
    );
}

function gaplessHandler(args: {
    currentTime: number;
    duration: number;
    isFlac: boolean;
    isTransitioning: boolean;
    nextPlayerRef: ReactPlayer | null | undefined;
    setIsTransitioning: Dispatch<boolean>;
}) {
    const { nextPlayerRef, currentTime, duration, isTransitioning, setIsTransitioning, isFlac } =
        args;

    if (!isTransitioning) {
        if (currentTime > duration - 2) {
            return setIsTransitioning(true);
        }

        return null;
    }

    const durationPadding = getDurationPadding(isFlac);

    if (currentTime + durationPadding >= duration) {
        return nextPlayerRef
            ?.getInternalPlayer()
            ?.play()
            .catch(() => {});
    }

    return null;
}

function getDuration(ref: ReactPlayer | null | undefined) {
    return ref?.getInternalPlayer()?.duration || 0;
}

function getDurationPadding(isFlac: boolean) {
    switch (isFlac) {
        case true:
            return 0.065;
        case false:
            return 0.116;
    }
}
