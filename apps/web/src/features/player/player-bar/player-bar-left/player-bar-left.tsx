import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { useCurrentTrack } from '@/features/player/stores/player-store.tsx';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { Image } from '@/features/ui/image/image.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './player-bar-left.module.scss';

export function PlayerBarLeft() {
    const shouldReduceMotion = useReducedMotion();
    const currentTrack = useCurrentTrack();
    const baseUrl = useAuthBaseUrl();

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
                    <Image
                        alt=""
                        className={styles.image}
                        src={`${baseUrl}${currentTrack?.imageUrl}&size=100`}
                    />
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
