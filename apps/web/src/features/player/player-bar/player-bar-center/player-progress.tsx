import { useCallback, useEffect, useState } from 'react';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import {
    subscribePlayerProgress,
    usePlayerDuration,
} from '@/features/player/stores/player-store.tsx';
import { Slider } from '@/features/ui/slider/slider.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import { formatDuration } from '@/utils/format-duration.ts';
import styles from './player-progress.module.scss';

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

    const onChange = useCallback((value: number[]) => {
        setIsDragging(true);
        setValue(value[0]);
    }, []);

    const onChangeEnd = useCallback((value: number[]) => {
        setIsDragging(false);
        PlayerController.call({
            cmd: {
                mediaSeekToTimestamp: {
                    timestamp: value[0],
                },
            },
        });
    }, []);

    return (
        <div className={styles.container}>
            {Boolean(duration) && (
                <Text isMonospace size="sm">
                    {formatDuration(Math.min(value, duration))}
                </Text>
            )}
            <Slider
                defaultValue={[0]}
                max={duration}
                min={0}
                orientation="horizontal"
                step={1}
                tooltip={false}
                value={[value]}
                onChange={onChange}
                onChangeEnd={onChangeEnd}
            />
            {Boolean(duration) && (
                <Text isMonospace size="sm">
                    {formatDuration(duration)}
                </Text>
            )}
        </div>
    );
}
