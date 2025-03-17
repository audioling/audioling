import { ActionIcon, Button, Divider, Group, Popover, Slider, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Icon } from '/@/components/icon/icon';
import {
    PlayerTransition,
    QueueType,
    usePlayerProperties,
    usePlayerStore,
} from '/@/stores/player-store';

export function PlayerSettingsButton() {
    return (
        <Popover position="top">
            <Popover.Target>
                <ActionIcon size="lg" variant="transparent">
                    <Icon icon="mediaSettings" />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <PlayerSettings />
            </Popover.Dropdown>
        </Popover>
    );
}

export function PlayerSettings() {
    const { t } = useTranslation();
    const { crossfadeDuration, queueType, speed, transitionType } = usePlayerProperties();
    const setPlayerTransition = usePlayerStore.use.setTransitionType();
    const setCrossfadeDuration = usePlayerStore.use.setCrossfadeDuration();
    const setSpeed = usePlayerStore.use.setSpeed();
    const setQueueType = usePlayerStore.use.setQueueType();

    return (
        <Stack gap="lg" w="300px">
            <Group grow align="center" justify="between">
                <Text>Transition</Text>
                <Button
                    size="compact-sm"
                    variant={transitionType === PlayerTransition.GAPLESS ? 'secondary' : 'default'}
                    onClick={() => setPlayerTransition(PlayerTransition.GAPLESS)}
                >
                    Normal
                </Button>
                <Button
                    size="compact-sm"
                    variant={transitionType === PlayerTransition.CROSSFADE ? 'secondary' : 'default'}
                    onClick={() => setPlayerTransition(PlayerTransition.CROSSFADE)}
                >
                    Crossfade
                </Button>
            </Group>
            <Group align="center" gap="xs" justify="between" wrap="nowrap">
                <Text>{t('app.player.crossfade')}</Text>
                <Slider
                    defaultValue={crossfadeDuration}
                    disabled={transitionType !== PlayerTransition.CROSSFADE}
                    label={null}
                    max={10}
                    min={0.5}
                    size="xs"
                    step={0.1}
                    onChange={value => setCrossfadeDuration(value)}
                />
                <Text variant="secondary">
                    {crossfadeDuration.toFixed(2)}
                    s
                </Text>
            </Group>
            <Group align="center" gap="xs" justify="between" wrap="nowrap">
                <Text>{t('app.player.speed')}</Text>
                <Slider
                    defaultValue={speed}
                    label={null}
                    max={2}
                    min={0.5}
                    size="xs"
                    step={0.05}
                    onChange={value => setSpeed(value)}
                />
                <Text variant="secondary">
                    {speed.toFixed(2)}
                    x
                </Text>
            </Group>
            <Divider />
            <Group grow align="center" justify="between">
                <Text>{t('app.player.queueType')}</Text>
                <Button
                    size="compact-sm"
                    variant={queueType === QueueType.DEFAULT ? 'secondary' : 'default'}
                    onClick={() => setQueueType(QueueType.DEFAULT)}
                >
                    {t('app.player.default')}
                </Button>
                <Button
                    size="compact-sm"
                    variant={queueType === QueueType.PRIORITY ? 'secondary' : 'default'}
                    onClick={() => setQueueType(QueueType.PRIORITY)}
                >
                    {t('app.player.priority')}
                </Button>
            </Group>
        </Stack>
    );
}
