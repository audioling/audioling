import { type WheelEvent } from 'react';
import { usePlayerStore } from '@/features/player/stores/player-store.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import type { AppIcon } from '@/features/ui/icon/icon.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { Popover } from '@/features/ui/popover/popover.tsx';
import { Slider } from '@/features/ui/slider/slider.tsx';
import { useBreakpoints } from '@/hooks/use-media-query.ts';
import styles from './volume-button.module.scss';

export function VolumeButton() {
    const { isLargerThanLg } = useBreakpoints();
    const increaseVolume = usePlayerStore.use.increaseVolume();
    const decreaseVolume = usePlayerStore.use.decreaseVolume();
    const toggleMute = usePlayerStore.use.mediaToggleMute();
    const volume = usePlayerStore.use.player().volume;
    const isMuted = usePlayerStore.use.player().muted;

    const handleScroll = (e: WheelEvent) => {
        if (e.deltaY > 0) {
            decreaseVolume(5);
        } else {
            increaseVolume(5);
        }
    };

    if (isLargerThanLg) {
        return (
            <Group gap="xs">
                <IconButton
                    isCompact
                    icon={getVolumeIcon(volume, isMuted)}
                    size="lg"
                    onClick={toggleMute}
                    onWheel={handleScroll}
                />
                <VolumeSlider
                    containerClassName={styles.horizontalSliderContainer}
                    orientation="horizontal"
                    onWheel={handleScroll}
                />
            </Group>
        );
    }

    return (
        <Popover side="top" width="target">
            <Popover.Target>
                <IconButton
                    isCompact
                    icon={getVolumeIcon(volume, isMuted)}
                    size="lg"
                    onWheel={handleScroll}
                />
            </Popover.Target>
            <Popover.Dropdown>
                <VolumeSlider
                    containerClassName={styles.verticalSliderContainer}
                    orientation="vertical"
                    onWheel={handleScroll}
                />
            </Popover.Dropdown>
        </Popover>
    );
}

interface VolumeSliderProps {
    containerClassName?: string;
    onWheel: (e: WheelEvent) => void;
    orientation: 'horizontal' | 'vertical';
}

function VolumeSlider(props: VolumeSliderProps) {
    const { containerClassName, onWheel, orientation } = props;
    const volume = usePlayerStore.use.player().volume;
    const setVolume = usePlayerStore.use.setVolume();

    return (
        <div className={containerClassName} onWheel={onWheel}>
            <Slider
                defaultValue={[volume]}
                max={100}
                min={0}
                orientation={orientation}
                step={1}
                value={[volume]}
                onChange={(value) => setVolume(value[0])}
            />
        </div>
    );
}

function getVolumeIcon(volume: number, isMuted: boolean): keyof typeof AppIcon {
    if (isMuted) {
        return 'volumeMute';
    }

    if (volume < 50) {
        return 'volumeNormal';
    }

    return 'volumeMax';
}
