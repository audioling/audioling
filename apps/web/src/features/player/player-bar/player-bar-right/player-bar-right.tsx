import { FavoriteButton } from '@/features/player/player-bar/player-bar-right/favorite-button.tsx';
import { PlayerSettingsButton } from '@/features/player/player-bar/player-bar-right/player-settings-button.tsx';
import { VolumeButton } from '@/features/player/player-bar/player-bar-right/volume-button.tsx';
import styles from './player-bar-right.module.scss';

export function PlayerBarRight() {
    return (
        <div className={styles.right}>
            <FavoriteButton />
            <PlayerSettingsButton />
            <VolumeButton />
        </div>
    );
}
