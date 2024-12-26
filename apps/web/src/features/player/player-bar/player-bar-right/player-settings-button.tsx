import {
    PlayerTransition,
    usePlayerProperties,
    usePlayerStore,
} from '@/features/player/stores/player-store.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { Popover } from '@/features/ui/popover/popover.tsx';
import { SelectInput } from '@/features/ui/select-input/select-input.tsx';
import { Slider } from '@/features/ui/slider/slider.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { Text } from '@/features/ui/text/text.tsx';

export function PlayerSettingsButton() {
    return (
        <Popover position="top">
            <Popover.Target>
                <IconButton isCompact icon="mediaSettings" size="lg" />
            </Popover.Target>
            <Popover.Content>
                <PlayerSettings />
            </Popover.Content>
        </Popover>
    );
}

export function PlayerSettings() {
    const { crossfadeDuration, speed, transitionType } = usePlayerProperties();
    const setPlayerTransition = usePlayerStore.use.setTransitionType();
    const setCrossfadeDuration = usePlayerStore.use.setCrossfadeDuration();
    const setSpeed = usePlayerStore.use.setSpeed();
    return (
        <Stack p="sm" w="300px">
            <SelectInput
                data={[
                    { label: 'Normal', value: PlayerTransition.GAPLESS },
                    { label: 'Crossfade', value: PlayerTransition.CROSSFADE },
                ]}
                label="Transition"
                value={transitionType}
                onChange={(value) => setPlayerTransition(value as PlayerTransition)}
            />
            {transitionType === PlayerTransition.CROSSFADE && (
                <Stack as="section">
                    <Group justify="between">
                        <Text isNoSelect>Crossfade Duration</Text>
                        <Text isNoSelect isSecondary>
                            {crossfadeDuration}s
                        </Text>
                    </Group>
                    <Slider
                        defaultValue={[crossfadeDuration]}
                        max={10}
                        min={0.5}
                        orientation="horizontal"
                        step={0.1}
                        tooltipFormatter={(value) => `${value.toFixed(2)}s`}
                        onChange={(value) => setCrossfadeDuration(value[0])}
                    />
                </Stack>
            )}
            <Stack as="section" gap="xs">
                <Group justify="between">
                    <Text isNoSelect>Speed</Text>
                    <Text isNoSelect isSecondary>
                        {speed}x
                    </Text>
                </Group>
                <Slider
                    defaultValue={[speed]}
                    max={2}
                    min={0.5}
                    orientation="horizontal"
                    step={0.05}
                    tooltipFormatter={(value) => `${value}x`}
                    onChange={(value) => setSpeed(value[0])}
                />
            </Stack>
        </Stack>
    );
}
