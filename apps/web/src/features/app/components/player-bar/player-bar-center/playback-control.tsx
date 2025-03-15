import { ActionIcon } from '@mantine/core';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import styles from './playback-control.module.css';
import { Icon } from '/@/components/icon/icon';
import { Tooltip } from '/@/components/tooltip/tooltip';
import {
    PlayerRepeat,
    PlayerShuffle,
    PlayerStatus,
    usePlayerActions,
    usePlayerRepeat,
    usePlayerShuffle,
    usePlayerStatus,
    usePlayerStore,
} from '/@/stores/player-store';

export function PlayPauseButton() {
    const { t } = useTranslation();
    const status = usePlayerStatus();
    const { mediaPause, mediaPlay } = usePlayerActions();

    const handleClick = () => {
        if (status === PlayerStatus.PLAYING) {
            mediaPause();
        }
        else {
            mediaPlay();
        }
    };

    return (
        <Tooltip
            label={t(status === PlayerStatus.PLAYING ? 'app.player.mediaPause' : 'app.player.mediaPlay')}
            openDelay={500}
            position="top"
        >
            <ActionIcon
                className={clsx(styles.playPause, styles.main)}
                radius="xl"
                size="lg"
                variant="filled"
                onClick={handleClick}
            >
                <Icon fill="inherit" icon={status === PlayerStatus.PLAYING ? 'mediaPause' : 'mediaPlay'} size="md" />
            </ActionIcon>
        </Tooltip>
    );
}

export function MediaPreviousButton() {
    const { t } = useTranslation();
    const { mediaPrevious } = usePlayerActions();

    return (
        <Tooltip label={t('app.player.mediaPrevious')} openDelay={500} position="top">
            <ActionIcon
                radius="xl"
                size="md"
                variant="subtle"
                onClick={mediaPrevious}
            >
                <Icon fill="primary" icon="mediaPrevious" />
            </ActionIcon>
        </Tooltip>
    );
}

export function MediaNextButton() {
    const { t } = useTranslation();
    const { mediaNext } = usePlayerActions();

    return (
        <Tooltip label={t('app.player.mediaNext')} openDelay={500} position="top">
            <ActionIcon
                radius="xl"
                size="md"
                variant="subtle"
                onClick={mediaNext}
            >
                <Icon fill="primary" icon="mediaNext" />
            </ActionIcon>
        </Tooltip>
    );
}

export function MediaStepBackwardButton() {
    const { t } = useTranslation();
    const { mediaStepBackward } = usePlayerActions();

    return (
        <Tooltip label={t('app.player.mediaSeekBackward')} openDelay={500} position="top">
            <ActionIcon
                radius="xl"
                size="md"
                variant="subtle"
                visibleFrom="sm"
                onClick={mediaStepBackward}

            >
                <Icon fill="primary" icon="mediaStepBackward" />
            </ActionIcon>
        </Tooltip>
    );
}

export function MediaStepForwardButton() {
    const { t } = useTranslation();
    const { mediaStepForward } = usePlayerActions();

    return (
        <Tooltip label={t('app.player.mediaSeekForward')} openDelay={500} position="top">
            <ActionIcon
                radius="xl"
                size="md"
                variant="subtle"
                visibleFrom="sm"
                onClick={mediaStepForward}
            >
                <Icon fill="primary" icon="mediaStepForward" />
            </ActionIcon>
        </Tooltip>
    );
}

export function MediaShuffleButton() {
    const { t } = useTranslation();
    const shuffle = usePlayerShuffle();
    const setShuffle = usePlayerStore.use.setShuffle();

    const iconState = shuffle === PlayerShuffle.TRACK ? 'secondary' : undefined;

    const handleClick = () => {
        if (shuffle === PlayerShuffle.TRACK) {
            setShuffle(PlayerShuffle.OFF);
        }
        else {
            setShuffle(PlayerShuffle.TRACK);
        }
    };

    return (
        <Tooltip label={t('app.player.mediaShuffle')} openDelay={500} position="top">
            <ActionIcon
                disabled
                radius="xl"
                size="md"
                variant="subtle"
                visibleFrom="xs"
                onClick={handleClick}
            >
                <Icon fill={iconState} icon="mediaShuffle" />
            </ActionIcon>
        </Tooltip>
    );
}

export function MediaRepeatButton() {
    const { t } = useTranslation();
    const repeat = usePlayerRepeat();
    const setRepeat = usePlayerStore.use.setRepeat();

    const fillState = repeat === PlayerRepeat.ONE || repeat === PlayerRepeat.ALL ? 'secondary' : undefined;

    const handleClick = () => {
        if (repeat === PlayerRepeat.ONE) {
            setRepeat(PlayerRepeat.ALL);
        }
        else if (repeat === PlayerRepeat.ALL) {
            setRepeat(PlayerRepeat.OFF);
        }
        else {
            setRepeat(PlayerRepeat.ONE);
        }
    };

    return (
        <Tooltip label={t('app.player.mediaRepeat')} openDelay={500} position="top">
            <ActionIcon
                disabled
                radius="xl"
                size="md"
                variant="subtle"
                visibleFrom="xs"
                onClick={handleClick}
            >
                <Icon fill={fillState} icon={repeat === PlayerRepeat.ONE ? 'mediaRepeatOne' : 'mediaRepeat'} />
            </ActionIcon>
        </Tooltip>
    );
}
