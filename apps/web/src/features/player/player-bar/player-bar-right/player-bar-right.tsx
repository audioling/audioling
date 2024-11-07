import { Group } from '@/features/ui/group/group.tsx';
import { IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';
import styles from './player-bar-right.module.scss';

export function PlayerBarRight() {
    return (
        <div className={styles.right}>
            <Group gap="lg" wrap="nowrap">
                <IconButtonWithTooltip
                    iconFill
                    icon="favorite"
                    size="lg"
                    style={{ padding: 0 }}
                    tooltipProps={{ label: 'Favorite', openDelay: 500 }}
                />

                <IconButtonWithTooltip
                    iconFill
                    icon="volumeNormal"
                    size="lg"
                    style={{ padding: 0 }}
                    tooltipProps={{ label: 'Volume', openDelay: 500 }}
                />
            </Group>
        </div>
    );
}
