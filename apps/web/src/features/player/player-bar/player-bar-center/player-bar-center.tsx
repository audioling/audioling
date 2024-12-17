import {
    MediaNextButton,
    MediaPreviousButton,
    MediaStepBackwardButton,
    MediaStepForwardButton,
    PlayPauseButton,
} from '@/features/player/player-bar/player-bar-center/playback-control.tsx';
import { PlayerProgress } from '@/features/player/player-bar/player-bar-center/player-progress.tsx';
import styles from './player-bar-center.module.scss';

export function PlayerBarCenter() {
    return (
        <div className={styles.center}>
            <div className={styles.controls}>
                <MediaPreviousButton />
                <MediaStepBackwardButton />
                <PlayPauseButton />
                <MediaStepForwardButton />
                <MediaNextButton />
            </div>
            <PlayerProgress />
        </div>
    );
}
