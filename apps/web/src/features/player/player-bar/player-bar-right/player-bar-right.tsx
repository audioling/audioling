import { FavoriteButton } from '@/features/player/player-bar/player-bar-right/favorite-button.tsx';
import { SettingsButton } from '@/features/player/player-bar/player-bar-right/settings-button.tsx';
import { VolumeButton } from '@/features/player/player-bar/player-bar-right/volume-button.tsx';
import styles from './player-bar-right.module.scss';

export function PlayerBarRight() {
    return (
        <div className={styles.right}>
            <SettingsButton />
            <FavoriteButton />
            <VolumeButton />
        </div>
    );
}
