import { Box, Slider, Text } from '@mantine/core';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import styles from './player-progress.module.css';
import { PlayerController } from '/@/controllers/player-controller';
import { subscribePlayerProgress, usePlayerDuration } from '/@/stores/player-store';
import { formatDuration } from '/@/utils/format-duration';

export function PlayerProgress() {
    const duration = usePlayerDuration();

    const [value, setValue] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribePlayerProgress((timestamp) => {
            if (!isDragging) {
                setValue(timestamp);
            }
        });

        return () => unsubscribe();
    }, [isDragging]);

    const onChange = useCallback((value: number) => {
        setIsDragging(true);
        setValue(value);
    }, []);

    const onChangeEnd = useCallback((value: number) => {
        setIsDragging(false);
        PlayerController.call({
            cmd: {
                mediaSeekToTimestamp: {
                    timestamp: value,
                },
            },
        });
    }, []);

    return (
        <Box className={styles.container}>
            <Text
                className={clsx({
                    [styles.hide]: !duration,
                })} size="sm" variant="monospace"
            >
                {formatDuration(Math.min(value, duration ?? 0))}
            </Text>
            <Slider
                classNames={{
                    root: styles.root,
                }}
                defaultValue={0}
                disabled={!duration}
                label={formatDuration(value)}
                max={duration}
                min={0}
                size="xs"
                step={1}
                value={value}
                onChange={onChange}
                onChangeEnd={onChangeEnd}
            />
            <Text
                className={clsx({ [styles.hide]: !duration })}
                size="sm"
                variant="monospace"
            >
                {formatDuration(duration ?? 0)}
            </Text>
        </Box>
    );
}
