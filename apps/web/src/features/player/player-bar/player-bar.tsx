import { PlayerBarCenter } from '@/features/player/player-bar/player-bar-center.tsx';
import { PlayerBarLeft } from '@/features/player/player-bar/player-bar-left.tsx';
import { PlayerBarRight } from '@/features/player/player-bar/player-bar-right.tsx';
import styles from './player-bar.module.scss';

export const PlayerBar = () => {
    return (
        <div
            className={styles.playerBar}
            id="player-bar"
        >
            <PlayerBarLeft></PlayerBarLeft>
            <PlayerBarCenter></PlayerBarCenter>
            <PlayerBarRight></PlayerBarRight>
        </div>
    );
};
