import type { WheelEvent } from 'react';
import { ActionIcon, Group, Popover, Slider } from '@mantine/core';
import clsx from 'clsx';
import styles from './volume-button.module.css';
import { type AppIcon, Icon } from '/@/components/icon/icon';
import { usePlayerMuted, usePlayerStore, usePlayerVolume } from '/@/stores/player-store';

export function VolumeButton() {
    const isLargerThanLg = true;
    const increaseVolume = usePlayerStore.use.increaseVolume();
    const decreaseVolume = usePlayerStore.use.decreaseVolume();
    const toggleMute = usePlayerStore.use.mediaToggleMute();
    const volume = usePlayerVolume();
    const isMuted = usePlayerMuted();

    const handleScroll = (e: WheelEvent) => {
        if (e.deltaY > 0) {
            decreaseVolume(5);
        }
        else {
            increaseVolume(5);
        }
    };

    if (isLargerThanLg) {
        return (
            <Group gap="xs">
                <ActionIcon
                    size="lg"
                    variant="transparent"
                    onClick={toggleMute}
                    onWheel={handleScroll}
                >
                    <Icon icon={getVolumeIcon(volume, isMuted)} />
                </ActionIcon>
                <VolumeSlider
                    containerClassName={styles.horizontalSliderContainer}
                    isMuted={isMuted}
                    onWheel={handleScroll}
                />
            </Group>
        );
    }

    return (
        <Popover position="top" width="target">
            <Popover.Target>
                <ActionIcon
                    size="lg"
                    variant="transparent"
                    onClick={toggleMute}
                    onWheel={handleScroll}
                >
                    <Icon icon={getVolumeIcon(volume, isMuted)} />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <VolumeSlider
                    // containerClassName={styles.verticalSliderContainer}
                    isMuted={isMuted}
                    onWheel={handleScroll}
                />
            </Popover.Dropdown>
        </Popover>
    );
}

interface VolumeSliderProps {
    containerClassName?: string;
    isMuted: boolean;
    onWheel: (e: WheelEvent) => void;
}

function VolumeSlider(props: VolumeSliderProps) {
    const { containerClassName, isMuted, onWheel } = props;
    const volume = usePlayerVolume();
    const setVolume = usePlayerStore.use.setVolume();

    return (
        <div className={clsx(containerClassName, { [styles.muted]: isMuted })} onWheel={onWheel}>
            <Slider
                defaultValue={volume}
                max={100}
                min={0}
                size="xs"
                step={1}
                value={volume}
                onChange={setVolume}
            />
        </div>
    );
}

function getVolumeIcon(volume: number, isMuted: boolean): keyof typeof AppIcon {
    if (isMuted) {
        return 'volumeMute';
    }

    if (volume < 25) {
        return 'volumeNormal';
    }

    return 'volumeMax';
}
