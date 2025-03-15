import type { WebAudioEngineHandle } from '/@/features/player/components/audio-player/engine/web-audio-engine';
import type { Dispatch } from 'react';
import type ReactPlayer from 'react-player';
import type { OnProgressProps } from 'react-player/base';
import { useCallback, useRef, useState } from 'react';
import { WebAudioEngine } from '/@/features/player/components/audio-player/engine/web-audio-engine';
import { usePlayerEvents } from '/@/features/player/components/audio-player/listener/use-player-events';
import { getStreamUrl } from '/@/features/player/components/audio-player/utils';
import {
    PlayerStatus,
    PlayerTransition,
    usePlayerActions,
    usePlayerData,
    usePlayerMuted,
    usePlayerProperties,
    usePlayerVolume,
} from '/@/stores/player-store';

const PLAY_PAUSE_FADE_DURATION = 300;
const PLAY_PAUSE_FADE_INTERVAL = 10;

export function AudiolingWebPlayer() {
    const playerRef = useRef<WebAudioEngineHandle>(null);
    const { player, player1, player2 } = usePlayerData();
    const { mediaAutoNext, setProgress } = usePlayerActions();
    const { crossfadeDuration, speed, transitionType } = usePlayerProperties();
    const isMuted = usePlayerMuted();
    const volume = usePlayerVolume();

    const [localPlayerStatus, setLocalPlayerStatus] = useState<PlayerStatus>(player.status);
    const [isTransitioning, setIsTransitioning] = useState<string | boolean>(false);

    const fadeAndSetStatus = useCallback(
        async (startVolume: number, endVolume: number, duration: number, status: PlayerStatus) => {
            if (isTransitioning) {
                return setLocalPlayerStatus(status);
            }

            const steps = duration / PLAY_PAUSE_FADE_INTERVAL;
            const volumeStep = (endVolume - startVolume) / steps;
            let currentStep = 0;

            const promise = new Promise((resolve) => {
                const interval = setInterval(() => {
                    currentStep++;
                    const newVolume = startVolume + volumeStep * currentStep;

                    playerRef.current?.setVolume(newVolume);

                    if (currentStep >= steps) {
                        clearInterval(interval);
                        setIsTransitioning(false);
                        resolve(true);
                    }
                }, PLAY_PAUSE_FADE_INTERVAL);
            });

            if (status === PlayerStatus.PAUSED) {
                await promise;
                setLocalPlayerStatus(status);
            }
            else if (status === PlayerStatus.PLAYING) {
                setLocalPlayerStatus(status);
                await promise;
            }
        },
        [isTransitioning],
    );

    const onProgressPlayer1 = useCallback(
        (e: OnProgressProps) => {
            if (transitionType === 'crossfade' && player.playerNum === 1) {
                setProgress(Number(e.playedSeconds.toFixed(0)));
            }
            else if (transitionType === 'gapless') {
                setProgress(Number(e.playedSeconds.toFixed(0)));
            }

            if (!playerRef.current?.player1()) {
                return;
            }

            switch (transitionType) {
                case PlayerTransition.GAPLESS:
                    gaplessHandler({
                        currentTime: e.playedSeconds,
                        duration: getDuration(playerRef.current.player1().ref),
                        isFlac: false,
                        isTransitioning,
                        nextPlayer: playerRef.current.player2(),
                        setIsTransitioning,
                    });
                    break;
                case PlayerTransition.CROSSFADE:
                    crossfadeHandler({
                        crossfadeDuration,
                        currentPlayer: playerRef.current.player1(),
                        currentPlayerNum: player.playerNum,
                        currentTime: e.playedSeconds,
                        duration: getDuration(playerRef.current.player1().ref),
                        isTransitioning,
                        nextPlayer: playerRef.current.player2(),
                        playerNum: 1,
                        setIsTransitioning,
                        volume,
                    });
                    break;
            }
        },
        [crossfadeDuration, isTransitioning, player.playerNum, setProgress, transitionType, volume],
    );

    const onProgressPlayer2 = useCallback(
        (e: OnProgressProps) => {
            if (transitionType === PlayerTransition.CROSSFADE && player.playerNum === 2) {
                setProgress(Number(e.playedSeconds.toFixed(0)));
            }
            else if (transitionType === PlayerTransition.GAPLESS) {
                setProgress(Number(e.playedSeconds.toFixed(0)));
            }

            if (!playerRef.current?.player2()) {
                return;
            }

            switch (transitionType) {
                case PlayerTransition.GAPLESS:
                    gaplessHandler({
                        currentTime: e.playedSeconds,
                        duration: getDuration(playerRef.current.player2().ref),
                        isFlac: false,
                        isTransitioning,
                        nextPlayer: playerRef.current.player1(),
                        setIsTransitioning,
                    });
                    break;
                case PlayerTransition.CROSSFADE:
                    crossfadeHandler({
                        crossfadeDuration,
                        currentPlayer: playerRef.current.player2(),
                        currentPlayerNum: player.playerNum,
                        currentTime: e.playedSeconds,
                        duration: getDuration(playerRef.current.player2().ref),
                        isTransitioning,
                        nextPlayer: playerRef.current.player1(),
                        playerNum: 2,
                        setIsTransitioning,
                        volume,
                    });
                    break;
            }
        },
        [crossfadeDuration, isTransitioning, player.playerNum, setProgress, transitionType, volume],
    );

    const handleOnEndedPlayer1 = useCallback(() => {
        const promise = new Promise((resolve) => {
            mediaAutoNext();
            resolve(true);
        });

        promise.then(() => {
            playerRef.current?.player1()?.ref?.getInternalPlayer().pause();
            playerRef.current?.setVolume(volume);
            setIsTransitioning(false);
        });
    }, [mediaAutoNext, volume]);

    const handleOnEndedPlayer2 = useCallback(() => {
        const promise = new Promise((resolve) => {
            mediaAutoNext();
            resolve(true);
        });

        promise.then(() => {
            playerRef.current?.player2()?.ref?.getInternalPlayer().pause();
            playerRef.current?.setVolume(volume);
            setIsTransitioning(false);
        });
    }, [mediaAutoNext, volume]);

    usePlayerEvents(
        {
            onPlayerSeekToTimestamp: (timestamp) => {
                if (player.playerNum === 1) {
                    playerRef.current?.player1()?.ref?.seekTo(timestamp);
                }
                else {
                    playerRef.current?.player2()?.ref?.seekTo(timestamp);
                }
            },
            onPlayerStatus: async (status) => {
                if (status === PlayerStatus.PAUSED) {
                    fadeAndSetStatus(volume, 0, PLAY_PAUSE_FADE_DURATION, PlayerStatus.PAUSED);
                }
                else if (status === PlayerStatus.PLAYING) {
                    fadeAndSetStatus(0, volume, PLAY_PAUSE_FADE_DURATION, PlayerStatus.PLAYING);
                }
            },
            onPlayerVolume: (volume) => {
                playerRef.current?.setVolume(volume);
            },
        },
        [volume, player.playerNum, isTransitioning],
    );

    const player1StreamUrl = player1 ? getStreamUrl(player1.id, player1._serverId) : undefined;
    const player2StreamUrl = player2 ? getStreamUrl(player2.id, player2._serverId) : undefined;

    return (
        <WebAudioEngine
            isMuted={isMuted}
            isTransitioning={Boolean(isTransitioning)}
            playerNum={player.playerNum}
            playerRef={playerRef}
            playerStatus={localPlayerStatus}
            speed={speed}
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
    isTransitioning: boolean | string;
    nextPlayer: {
        ref: ReactPlayer | null;
        setVolume: (volume: number) => void;
    };
    setIsTransitioning: Dispatch<boolean | string>;
}) {
    const { currentTime, duration, isFlac, isTransitioning, nextPlayer, setIsTransitioning } = args;

    if (!isTransitioning) {
        if (currentTime > duration - 2) {
            return setIsTransitioning(true);
        }

        return null;
    }

    const durationPadding = getDurationPadding(isFlac);

    if (currentTime + durationPadding >= duration) {
        return nextPlayer.ref
            ?.getInternalPlayer()
            ?.play()
            .catch(() => {});
    }

    return null;
}

function crossfadeHandler(args: {
    crossfadeDuration: number;
    currentPlayer: {
        ref: ReactPlayer | null;
        setVolume: (volume: number) => void;
    };
    currentPlayerNum: number;
    currentTime: number;
    duration: number;
    isTransitioning: boolean | string;
    nextPlayer: {
        ref: ReactPlayer | null;
        setVolume: (volume: number) => void;
    };
    playerNum: number;
    setIsTransitioning: Dispatch<boolean | string>;
    volume: number;
}) {
    const {
        crossfadeDuration,
        currentPlayer,
        currentPlayerNum,
        currentTime,
        duration,
        isTransitioning,
        nextPlayer,
        playerNum,
        setIsTransitioning,
        volume,
    } = args;
    const player = `player${playerNum}`;

    if (!isTransitioning) {
        if (currentTime > duration - crossfadeDuration) {
            nextPlayer.setVolume(0);
            nextPlayer.ref?.getInternalPlayer().play();
            return setIsTransitioning(player);
        }

        return;
    }

    if (isTransitioning !== player && currentPlayerNum !== playerNum) {
        return;
    }

    const timeLeft = duration - currentTime;

    // Calculate the volume levels based on time remaining
    const currentPlayerVolume = (timeLeft / crossfadeDuration) * volume;
    const nextPlayerVolume = ((crossfadeDuration - timeLeft) / crossfadeDuration) * volume;

    // Set volumes for both players
    currentPlayer.setVolume(currentPlayerVolume);
    nextPlayer.setVolume(nextPlayerVolume);
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
