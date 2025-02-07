import {
    PlayerTransition,
    usePlayerProperties,
    usePlayerStore,
} from '@/features/player/stores/player-store.tsx';
import { Button } from '@/features/ui/button/button.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { Popover } from '@/features/ui/popover/popover.tsx';
import { Slider } from '@/features/ui/slider/slider.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { Text } from '@/features/ui/text/text.tsx';

export function PlayerSettingsButton() {
    return (
        <Popover side="top">
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
        <Stack gap="lg" p="sm" w="300px">
            <Group grow align="center" justify="between">
                <Text isNoSelect>Transition</Text>
                <Button
                    isCompact
                    size="sm"
                    variant={transitionType === PlayerTransition.GAPLESS ? 'primary' : 'default'}
                    onClick={() => setPlayerTransition(PlayerTransition.GAPLESS)}
                >
                    Normal
                </Button>
                <Button
                    isCompact
                    size="sm"
                    variant={transitionType === PlayerTransition.CROSSFADE ? 'primary' : 'default'}
                    onClick={() => setPlayerTransition(PlayerTransition.CROSSFADE)}
                >
                    Crossfade
                </Button>
            </Group>
            {transitionType === PlayerTransition.CROSSFADE && (
                <Stack as="section" gap="xs">
                    <Group align="center" justify="between">
                        <Text isNoSelect>Crossfade</Text>

                        <Slider
                            defaultValue={[crossfadeDuration]}
                            max={10}
                            min={0.5}
                            orientation="horizontal"
                            step={0.1}
                            tooltipFormatter={(value) => `${value.toFixed(2)}s`}
                            onChange={(value) => setCrossfadeDuration(value[0])}
                        />
                        <Text isMonospace isNoSelect isSecondary>
                            {crossfadeDuration.toFixed(2)}s
                        </Text>
                    </Group>
                </Stack>
            )}
            <Stack as="section" gap="xs">
                <Group align="center" justify="between">
                    <Text isNoSelect>Speed</Text>

                    <Slider
                        defaultValue={[speed]}
                        max={2}
                        min={0.5}
                        orientation="horizontal"
                        step={0.05}
                        tooltipFormatter={(value) => `${value}x`}
                        onChange={(value) => setSpeed(value[0])}
                    />
                    <Text isMonospace isNoSelect isSecondary>
                        {speed.toFixed(2)}x
                    </Text>
                </Group>
            </Stack>
        </Stack>
    );
}
