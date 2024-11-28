import { Slider } from '@/features/ui/slider/slider.tsx';
import styles from './player-progress.module.scss';

interface PlayerProgressProps {
    currentTime: number;
    duration: number;
    onSeek: (value: number) => void;
}

export function PlayerProgress(props: PlayerProgressProps) {
    const { currentTime, duration, onSeek } = props;

    return (
        <div className={styles.container}>
            <Slider
                orientation="horizontal"
                {...props}
                defaultValue={[currentTime]}
                max={duration}
                min={0}
                onChange={(value) => onSeek(value[0])}
            />
        </div>
    );
}
