import { motion } from 'motion/react';
import { PlayType } from '@/features/player/stores/player-store.tsx';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { IconButton, IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';
import styles from './card-controls.module.scss';

interface CardControlsProps {
    id: string;
    onMore?: (id: string) => void;
    onPlay: (id: string, playType: PlayType) => void;
}

export function CardControls(props: CardControlsProps) {
    return (
        <motion.div
            animate="show"
            className={styles.cardControls}
            initial="hidden"
            variants={animationVariants.fadeIn}
        >
            <div className={styles.top}>
                <div className={styles.topLeft}></div>
                <div className={styles.topRight}>
                    <IconButtonWithTooltip
                        isCompact
                        icon="favorite"
                        size="lg"
                        tooltipProps={{ label: 'Add to favorites', openDelay: 500 }}
                        variant="transparent"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.onPlay(props.id, PlayType.LAST);
                        }}
                    />
                </div>
            </div>
            {Boolean(props.onPlay) && (
                <div className={styles.center}>
                    <IconButton
                        iconFill
                        className={styles.playButton}
                        icon="mediaPlay"
                        radius="xl"
                        size="lg"
                        variant="filled"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.onPlay?.(props.id, PlayType.NOW);
                        }}
                    />
                </div>
            )}
            <div className={styles.bottom}>
                <div className={styles.bottomLeft}>
                    <IconButtonWithTooltip
                        isCompact
                        icon="arrowRightS"
                        size="md"
                        tooltipProps={{ label: 'Play Next', openDelay: 500 }}
                        variant="filled"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.onPlay(props.id, PlayType.NEXT);
                        }}
                    />
                    <IconButtonWithTooltip
                        isCompact
                        icon="arrowRightLast"
                        size="md"
                        tooltipProps={{ label: 'Play Last', openDelay: 500 }}
                        variant="filled"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.onPlay(props.id, PlayType.LAST);
                        }}
                    />
                </div>
                <div className={styles.bottomRight}>
                    {Boolean(props.onMore) && (
                        <IconButton
                            isCompact
                            icon="ellipsisHorizontal"
                            size="lg"
                            variant="transparent"
                            onClick={(e) => {
                                e.stopPropagation();
                                props.onMore?.(props.id);
                            }}
                        />
                    )}
                </div>
            </div>
        </motion.div>
    );
}
