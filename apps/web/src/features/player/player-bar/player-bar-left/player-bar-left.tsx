import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { TrackItem } from '@/api/api-types.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import {
    subscribePlayerQueue,
    usePlayerActions,
    usePlayerStore,
} from '@/features/player/stores/player-store.tsx';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { Image } from '@/features/ui/image/image.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './player-bar-left.module.scss';

export function PlayerBarLeft() {
    const [currentTrack, setCurrentTrack] = useState<TrackItem | undefined>(undefined);
    const currentIndex = usePlayerStore.use.player().index;
    const { getQueue } = usePlayerActions();

    useEffect(() => {
        const set = () => {
            const queue = getQueue() || [];
            setCurrentTrack(queue.items[currentIndex]);
        };

        const unsub = subscribePlayerQueue(() => {
            set();
        });

        set();

        return () => unsub();
    }, [currentIndex, getQueue]);

    const baseUrl = useAuthBaseUrl();

    return (
        <div className={styles.left}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentTrack?.id}
                    animate="show"
                    className={styles.leftColumn}
                    exit="hidden"
                    initial="hidden"
                    variants={animationVariants.combine(animationVariants.fadeIn)}
                >
                    <Image
                        alt=""
                        className={styles.image}
                        src={`${baseUrl}${currentTrack?.imageUrl}&size=100`}
                    />
                </motion.div>
            </AnimatePresence>
            <motion.div className={styles.rightColumn}>
                {currentTrack ? (
                    <>
                        <Text isEllipsis>{currentTrack.name}</Text>
                        <Text isEllipsis isSecondary>
                            {currentTrack.album || 'Unknown Album'}
                        </Text>
                        <Text isEllipsis isSecondary>
                            {currentTrack.artists.map((artist) => artist.name).join(', ') ||
                                'Unknown Artist'}
                        </Text>
                    </>
                ) : (
                    <Text>No track selected</Text>
                )}
            </motion.div>
        </div>
    );
}
