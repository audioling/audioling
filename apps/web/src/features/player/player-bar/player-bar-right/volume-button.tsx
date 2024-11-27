import { type WheelEvent } from 'react';
import { usePlayerStore } from '@/features/player/stores/player-store.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { Popover } from '@/features/ui/popover/popover.tsx';
import { Slider } from '@/features/ui/slider/slider.tsx';
import styles from './volume-button.module.scss';

export function VolumeButton() {
    const increaseVolume = usePlayerStore.use.increaseVolume();
    const decreaseVolume = usePlayerStore.use.decreaseVolume();

    const handleScroll = (e: WheelEvent) => {
        if (e.deltaY > 0) {
            decreaseVolume(1);
        } else {
            increaseVolume(1);
        }
    };

    return (
        <Popover position="top" width="target">
            <Popover.Target>
                <IconButton icon="volumeNormal" size="lg" onWheel={handleScroll} />
            </Popover.Target>
            <Popover.Dropdown>
                <VolumeSlider onWheel={handleScroll} />
            </Popover.Dropdown>
        </Popover>
    );
}

interface VolumeSliderProps {
    onWheel: (e: WheelEvent) => void;
}

function VolumeSlider(props: VolumeSliderProps) {
    const { onWheel } = props;
    const volume = usePlayerStore.use.player().volume;
    const setVolume = usePlayerStore.use.setVolume();

    return (
        <div className={styles.sliderContainer} onWheel={onWheel}>
            <Slider
                defaultValue={[volume]}
                max={100}
                min={0}
                orientation="vertical"
                step={1}
                value={[volume]}
                onChange={(value) => setVolume(value[0])}
            />
        </div>
    );
}
