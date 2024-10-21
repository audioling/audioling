import { PlayerProgress } from '@/features/player/player-bar/player-bar-center/player-progress.tsx';
import styles from './player-bar-center.module.scss';

export function PlayerBarCenter() {
    return (
        <div className={styles.center}>
            <PlayerProgress currentTime={0} duration={100} onSeek={() => {}} />
        </div>
    );
}
