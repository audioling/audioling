import { PlayerBarCenter } from '@/features/player/player-bar/player-bar-center/player-bar-center.tsx';
import { PlayerBarLeft } from '@/features/player/player-bar/player-bar-left/player-bar-left.tsx';
import { PlayerBarRight } from '@/features/player/player-bar/player-bar-right/player-bar-right.tsx';
import styles from './player-bar.module.scss';

export function PlayerBar() {
    return (
        <div className={styles.playerBar} id="player-bar">
            <PlayerBarLeft></PlayerBarLeft>
            <PlayerBarCenter></PlayerBarCenter>
            <PlayerBarRight></PlayerBarRight>
        </div>
    );
}
