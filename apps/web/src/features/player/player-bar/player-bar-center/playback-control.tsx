import clsx from 'clsx';
import {
    PlayerStatus,
    usePlayerActions,
    usePlayerStatus,
} from '@/features/player/stores/player-store.tsx';
import { IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';
import styles from './playback-control.module.scss';

export function PlayPauseButton() {
    const status = usePlayerStatus();
    const { mediaPlay, mediaPause } = usePlayerActions();

    const handleClick = () => {
        if (status === PlayerStatus.PLAYING) {
            mediaPause();
        } else {
            mediaPlay();
        }
    };

    return (
        <IconButtonWithTooltip
            iconFill
            className={clsx(styles.playPause, styles.main)}
            icon={status === PlayerStatus.PLAYING ? 'mediaPause' : 'mediaPlay'}
            size="xl"
            tooltipProps={{
                label: status === PlayerStatus.PLAYING ? 'Pause' : 'Play',
                openDelay: 500,
                position: 'top',
            }}
            variant="filled"
            onClick={handleClick}
        />
    );
}

export function MediaPreviousButton() {
    const { mediaPrevious } = usePlayerActions();

    return (
        <IconButtonWithTooltip
            iconFill
            className={clsx(styles.secondary)}
            icon="mediaPrevious"
            size="lg"
            tooltipProps={{
                label: 'Previous',
                openDelay: 500,
                position: 'top',
            }}
            onClick={mediaPrevious}
        />
    );
}

export function MediaNextButton() {
    const { mediaNext } = usePlayerActions();

    return (
        <IconButtonWithTooltip
            iconFill
            className={clsx(styles.secondary)}
            icon="mediaNext"
            size="lg"
            tooltipProps={{
                label: 'Next',
                openDelay: 500,
                position: 'top',
            }}
            onClick={mediaNext}
        />
    );
}

export function MediaStepBackwardButton() {
    const { mediaStepBackward } = usePlayerActions();

    return (
        <IconButtonWithTooltip
            iconFill
            className={clsx(styles.secondary)}
            icon="mediaStepBackward"
            size="lg"
            tooltipProps={{
                label: 'Seek backward',
                openDelay: 500,
                position: 'top',
            }}
            onClick={mediaStepBackward}
        />
    );
}

export function MediaStepForwardButton() {
    const { mediaStepForward } = usePlayerActions();

    return (
        <IconButtonWithTooltip
            iconFill
            className={clsx(styles.secondary)}
            icon="mediaStepForward"
            size="lg"
            tooltipProps={{
                label: 'Seek forward',
                openDelay: 500,
                position: 'top',
            }}
            onClick={mediaStepForward}
        />
    );
}

export function MediaShuffleButton() {
    return (
        <IconButtonWithTooltip
            iconFill
            className={clsx(styles.secondary)}
            icon="mediaShuffle"
            size="lg"
            tooltipProps={{ label: 'Shuffle', openDelay: 500, position: 'top' }}
        />
    );
}

export function MediaRepeatButton() {
    return (
        <IconButtonWithTooltip
            iconFill
            className={clsx(styles.secondary)}
            icon="mediaRepeat"
            size="lg"
            tooltipProps={{ label: 'Repeat', openDelay: 500, position: 'top' }}
        />
    );
}
