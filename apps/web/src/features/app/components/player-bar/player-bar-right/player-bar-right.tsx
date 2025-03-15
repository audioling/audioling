import styles from './player-bar-right.module.css';
import { PlayerSettingsButton } from '/@/features/app/components/player-bar/player-bar-right/player-settings-button';
import { TrackFavoriteButton } from '/@/features/app/components/player-bar/player-bar-right/track-favorite-button';
import { VolumeButton } from '/@/features/app/components/player-bar/player-bar-right/volume-button';

export function PlayerBarRight() {
    return (
        <div className={styles.right}>
            <TrackFavoriteButton />
            <PlayerSettingsButton />
            <VolumeButton />
        </div>
    );
}
