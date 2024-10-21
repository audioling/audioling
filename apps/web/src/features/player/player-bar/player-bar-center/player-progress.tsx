import { Slider } from '@mantine/core';
import styles from './player-progress.module.scss';

interface PlayerProgressProps {
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
}

export function PlayerProgress({ currentTime, duration, onSeek }: PlayerProgressProps) {
    const classNames = {
        bar: styles.bar,
        root: styles.root,
        thumb: styles.thumb,
    };

    return (
        <Slider
            classNames={classNames}
            max={duration}
            min={0}
            value={currentTime}
            w="15rem"
            onChange={onSeek}
        />
    );
}
