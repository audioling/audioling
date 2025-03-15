import styles from './player-bar-center.module.css';
import {
    MediaNextButton,
    MediaPreviousButton,
    MediaRepeatButton,
    MediaShuffleButton,
    MediaStepBackwardButton,
    MediaStepForwardButton,
    PlayPauseButton,
} from '/@/features/app/components/player-bar/player-bar-center/playback-control';

export function PlayerBarCenter() {
    return (
        <div className={styles.center}>
            <div className={styles.controls}>
                <MediaRepeatButton />
                <MediaPreviousButton />
                <MediaStepBackwardButton />
                <PlayPauseButton />
                <MediaStepForwardButton />
                <MediaNextButton />
                <MediaShuffleButton />
            </div>
        </div>
    );
}
