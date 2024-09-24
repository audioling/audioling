import { PlayerBarCenter } from '@/features/player/components/player-bar-center.tsx';
import { PlayerBarLeft } from '@/features/player/components/player-bar-left.tsx';
import { PlayerBarRight } from '@/features/player/components/player-bar-right.tsx';
import styles from './player-bar.module.scss';

export const PlayerBar = () => {
    return (
        <footer
            className={styles.playerBar}
            id="player-bar"
        >
            <PlayerBarLeft></PlayerBarLeft>
            <PlayerBarCenter></PlayerBarCenter>
            <PlayerBarRight></PlayerBarRight>
        </footer>
    );
};
