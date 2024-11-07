import clsx from 'clsx';
import { IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';
import styles from './playback-control.module.scss';

export function PlayPauseButton() {
    return (
        <IconButtonWithTooltip
            iconFill
            className={clsx(styles.playPause, styles.main)}
            icon="mediaPlay"
            size="xl"
            tooltipProps={{
                label: 'Play',
                openDelay: 500,
                position: 'top',
            }}
            variant="filled"
        />
    );
}

export function MediaPreviousButton() {
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
        />
    );
}

export function MediaNextButton() {
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
        />
    );
}

export function MediaStepBackwardButton() {
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
        />
    );
}

export function MediaStepForwardButton() {
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
        />
    );
}
