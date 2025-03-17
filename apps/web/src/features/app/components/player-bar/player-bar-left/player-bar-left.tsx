import { Text } from '@mantine/core';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import styles from './player-bar-left.module.css';
import { animationVariants } from '/@/components/animations/variants';
import { ItemImage } from '/@/features/shared/components/item-image/item-image';
import { useCurrentTrack } from '/@/stores/player-store';

export function PlayerBarLeft() {
    const { t } = useTranslation();
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
                    <ItemImage
                        className={styles.image}
                        containerClassName={styles.imageContainer}
                        id={currentTrack?.imageUrl}
                        size="table"
                    />
                </motion.div>
                <motion.div className={styles.rightColumn}>
                    {currentTrack
                        ? (
                                <>
                                    <Text variant="default">{currentTrack.name}</Text>
                                    <Text variant="secondary">
                                        {currentTrack.album || 'Unknown Album'}
                                    </Text>
                                    <Text variant="secondary">
                                        {currentTrack.artists.map(artist => artist.name).join(', ')
                                        || 'Unknown Artist'}
                                    </Text>
                                </>
                            )
                        : (
                                <Text>{t('app.player.noTrackSelected')}</Text>
                            )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
