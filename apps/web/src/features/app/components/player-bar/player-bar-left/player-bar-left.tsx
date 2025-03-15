import { Text } from '@mantine/core';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import styles from './player-bar-left.module.css';

import { animationVariants } from '/@/components/animations/variants';
import { useCurrentTrack } from '/@/stores/player-store';

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
                    {/* <ItemImage className={styles.image} size="table" src={currentTrack?.imageUrl} /> */}
                </motion.div>
                <motion.div className={styles.rightColumn}>
                    {currentTrack
                        ? (
                                <>
                                    <Text variant="default-ellipsis">{currentTrack.name}</Text>
                                    <Text variant="secondary-ellipsis">
                                        {currentTrack.album || 'Unknown Album'}
                                    </Text>
                                    <Text variant="secondary-ellipsis">
                                        {currentTrack.artists.map(artist => artist.name).join(', ')
                                        || 'Unknown Artist'}
                                    </Text>
                                </>
                            )
                        : (
                                <Text>No track selected</Text>
                            )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
