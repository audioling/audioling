import { PlayerBarLeft } from './player-bar-left/player-bar-left';
import styles from './player-bar.module.css';
import { PlayerBarCenter } from '/@/features/app/components/player-bar/player-bar-center/player-bar-center';
import { PlayerProgress } from '/@/features/app/components/player-bar/player-bar-center/player-progress';
import { PlayerBarRight } from '/@/features/app/components/player-bar/player-bar-right/player-bar-right';

export function PlayerBar() {
    return (
        <div className={styles.playerBar} id="player-bar">
            <PlayerBarLeft />
            <PlayerBarCenter />
            <PlayerBarRight />
            <PlayerProgress />
        </div>
    );
}
