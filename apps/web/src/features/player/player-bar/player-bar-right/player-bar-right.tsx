import { Group } from '@/features/ui/group/group.tsx';
import { Icon } from '@/features/ui/icon/icon.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import styles from './player-bar-right.module.scss';

export function PlayerBarRight() {
    return (
        <div className={styles.right}>
            <Group gap="lg" wrap="nowrap">
                <Icon icon="favorite" size="xl" />
                <Icon icon="queueSide" size="xl" />
                <Icon icon="volumeNormal" size="xl" />
            </Group>
        </div>
    );
}
