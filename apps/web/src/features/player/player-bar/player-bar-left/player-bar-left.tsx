import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCurrentTrack } from '@/features/player/stores/player-store.tsx';
import { ItemImage } from '@/features/shared/item-image/item-image.tsx';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './player-bar-left.module.scss';

export function PlayerBarLeft() {
    const shouldReduceMotion = useReducedMotion();
    const { track: currentTrack } = useCurrentTrack();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentTrack?.id || 'no-track'}
                animate="show"
                className={styles.left}
                exit="hidden"
                initial="hidden"
                variants={shouldReduceMotion ? undefined : animationVariants.blurIn}
            >
                <motion.div className={styles.leftColumn}>
                    <ItemImage className={styles.image} size="table" src={currentTrack?.imageUrl} />
                </motion.div>
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
            </motion.div>
        </AnimatePresence>
    );
}
