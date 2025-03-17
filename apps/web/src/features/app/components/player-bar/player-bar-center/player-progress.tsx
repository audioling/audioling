import { Box, Slider } from '@mantine/core';
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

    if (!duration) {
        return null;
    }

    return (
        <Box className={styles.container}>
            {/* {Boolean(duration) && (
                <Text size="sm" variant="monospace">
                    {formatDuration(Math.min(value, duration))}
                </Text>
            )} */}
            <Slider
                classNames={{
                    root: styles.root,
                }}
                defaultValue={0}
                label={formatDuration(value)}
                max={duration}
                min={0}
                size="xs"
                step={1}
                value={value}
                onChange={onChange}
                onChangeEnd={onChangeEnd}
            />
            {/* {Boolean(duration) && (
                <Text size="sm" variant="monospace">
                    {formatDuration(duration)}
                </Text>
            )} */}
        </Box>
    );
}
