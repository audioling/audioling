import { useEffect, useState } from 'react';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import {
    subscribePlayerProgress,
    usePlayerDuration,
    usePlayerProgress,
} from '@/features/player/stores/player-store.tsx';
import { Slider } from '@/features/ui/slider/slider.tsx';
import styles from './player-progress.module.scss';

export function PlayerProgress() {
    const currentTime = usePlayerProgress();
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
    }, [currentTime, isDragging]);

    const onChange = (value: number[]) => {
        setIsDragging(true);
        setValue(value[0]);
    };

    const onChangeEnd = (value: number[]) => {
        setIsDragging(false);
        PlayerController.call({
            cmd: {
                mediaSeekToTimestamp: {
                    timestamp: value[0],
                },
            },
        });
    };

    return (
        <div className={styles.container}>
            <Slider
                defaultValue={[0]}
                max={duration}
                min={0}
                orientation="horizontal"
                step={1}
                value={[value]}
                onChange={onChange}
                onChangeEnd={onChangeEnd}
            />
        </div>
    );
}
