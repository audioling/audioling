import type { RefObject } from 'react';
import { useImperativeHandle, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import type { AudioPlayer } from '@/features/player/audio-player/types.ts';
import { PlayerStatus } from '@/features/player/stores/player-store.tsx';

export interface OnProgressProps {
    loaded: number;
    loadedSeconds: number;
    played: number;
    playedSeconds: number;
}

export interface WebAudioEngineHandle extends AudioPlayer {
    player1(): ReactPlayer | null;
    player2(): ReactPlayer | null;
}

interface WebAudioEngineProps {
    isMuted: boolean;
    isTransitioning: boolean;
    onEndedPlayer1: () => void;
    onEndedPlayer2: () => void;
    onProgressPlayer1: (e: OnProgressProps) => void;
    onProgressPlayer2: (e: OnProgressProps) => void;
    playerNum: number;
    playerRef: RefObject<WebAudioEngineHandle>;
    playerStatus: PlayerStatus;
    src1: string | undefined;
    src2: string | undefined;
}

// Credits: https://gist.github.com/novwhisky/8a1a0168b94f3b6abfaa?permalink_comment_id=1551393#gistcomment-1551393
// This is used so that the player will always have an <audio> element. This means that
// player1Source and player2Source are connected BEFORE the user presses play for
// the first time. This workaround is important for Safari, which seems to require the
// source to be connected PRIOR to resuming audio context
const EMPTY_SOURCE =
    'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU2LjQxAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV';

export const WebAudioEngine = (props: WebAudioEngineProps) => {
    const {
        isMuted,
        isTransitioning,
        onEndedPlayer1,
        onEndedPlayer2,
        onProgressPlayer1,
        onProgressPlayer2,
        playerNum,
        playerRef,
        playerStatus,
        src1,
        src2,
    } = props;

    const player1Ref = useRef<ReactPlayer | null>(null);
    const player2Ref = useRef<ReactPlayer | null>(null);

    const [internalVolume, setInternalVolume] = useState(25 / 100 || 0);

    useImperativeHandle<WebAudioEngineHandle, WebAudioEngineHandle>(playerRef, () => ({
        decreaseVolume(by: number) {
            setInternalVolume(internalVolume - by);
        },
        increaseVolume(by: number) {
            setInternalVolume(internalVolume + by);
        },
        pause() {
            player1Ref.current?.getInternalPlayer()?.pause();
            player2Ref.current?.getInternalPlayer()?.pause();
        },
        play() {
            if (playerNum === 1) {
                player1Ref.current?.getInternalPlayer()?.play();
            } else {
                player2Ref.current?.getInternalPlayer()?.play();
            }
        },
        player1() {
            return player1Ref?.current;
        },
        player2() {
            return player2Ref?.current;
        },
        seekTo(seekTo: number) {
            playerNum === 1
                ? player1Ref.current?.seekTo(seekTo)
                : player2Ref.current?.seekTo(seekTo);
        },
        setVolume(volume: number) {
            setInternalVolume(volume / 100 || 0);
        },
    }));

    return (
        <>
            <ReactPlayer
                ref={player1Ref}
                config={{
                    file: { attributes: { crossOrigin: 'anonymous' }, forceAudio: true },
                }}
                controls={false}
                height={0}
                muted={isMuted}
                playing={playerNum === 1 && playerStatus === PlayerStatus.PLAYING}
                progressInterval={isTransitioning ? 10 : 250}
                url={src1 || EMPTY_SOURCE}
                volume={convertToLogVolume(internalVolume)}
                width={0}
                onEnded={src1 ? () => onEndedPlayer1() : undefined}
                onProgress={onProgressPlayer1}
            />
            <ReactPlayer
                ref={player2Ref}
                config={{
                    file: { attributes: { crossOrigin: 'anonymous' }, forceAudio: true },
                }}
                controls={false}
                height={0}
                muted={isMuted}
                playing={playerNum === 2 && playerStatus === PlayerStatus.PLAYING}
                progressInterval={isTransitioning ? 10 : 250}
                url={src2 || EMPTY_SOURCE}
                volume={convertToLogVolume(internalVolume)}
                width={0}
                onEnded={src2 ? () => onEndedPlayer2() : undefined}
                onProgress={onProgressPlayer2}
            />
        </>
    );
};

WebAudioEngine.displayName = 'WebPlayer';

function convertToLogVolume(linearVolume: number) {
    return Math.pow(linearVolume, 2.0);
}
