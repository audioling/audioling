import { PlayerSettingsButton } from '@/features/player/player-bar/player-bar-right/player-settings-button.tsx';
import { TrackFavoriteButton } from '@/features/player/player-bar/player-bar-right/track-favorite-button.tsx';
import { VolumeButton } from '@/features/player/player-bar/player-bar-right/volume-button.tsx';
import styles from './player-bar-right.module.scss';

export function PlayerBarRight() {
    return (
        <div className={styles.right}>
            <TrackFavoriteButton />
            <PlayerSettingsButton />
            <VolumeButton />
        </div>
    );
}
