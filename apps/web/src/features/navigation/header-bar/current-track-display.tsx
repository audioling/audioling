import { AnimatePresence, motion } from 'motion/react';
import type { PlayQueueItem } from '@/api/api-types.ts';
import { useCurrentTrack } from '@/features/player/stores/player-store.tsx';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './current-track-display.module.scss';

export function CurrentTrackDisplay() {
    const { track: currentTrack, index, length } = useCurrentTrack();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentTrack?._uniqueId}
                animate="show"
                className={styles.titleContainer}
                exit="hidden"
                initial="hidden"
                variants={animationVariants.blurIn}
            >
                <Text isEllipsis isNoSelect size="md">
                    {getTitle(index, length, currentTrack)}
                </Text>
            </motion.div>
        </AnimatePresence>
    );
}

function getTitle(index: number, length: number, track?: PlayQueueItem) {
    if (!track) {
        return '';
    }

    return `(${index + 1} / ${length}) ${track.artistName} — ${track.name}`;
}
