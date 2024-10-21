import { Text } from '@/features/ui/text/text.tsx';
import styles from './player-bar-left.module.scss';

export function PlayerBarLeft() {
    return (
        <div className={styles.left}>
            <div className={styles.leftColumn}>
                <img alt="" className={styles.image} src={''} />
            </div>
            <div className={styles.rightColumn}>
                <Text>Title</Text>
                <Text isSecondary>Album</Text>
                <Text isSecondary>Artist</Text>
            </div>
        </div>
    );
}
