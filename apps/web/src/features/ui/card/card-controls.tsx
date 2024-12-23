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
            <div className={styles.top}></div>
            {Boolean(props.onPlay) && (
                <div className={styles.center}>
                    <IconButton
                        iconFill
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
                        icon="arrowRightS"
                        radius="lg"
                        size="md"
                        tooltipProps={{ label: 'Play Next', openDelay: 500 }}
                        variant="filled"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.onPlay(props.id, PlayType.NEXT);
                        }}
                    />
                    <IconButtonWithTooltip
                        icon="arrowRightLast"
                        radius="lg"
                        size="md"
                        tooltipProps={{ label: 'Play Last', openDelay: 500 }}
                        variant="filled"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.onPlay(props.id, PlayType.LAST);
                        }}
                    />
                </div>
                {Boolean(props.onMore) && (
                    <div>
                        <IconButton
                            icon="ellipsisHorizontal"
                            radius="lg"
                            size="md"
                            variant="transparent"
                            onClick={(e) => {
                                e.stopPropagation();
                                props.onMore?.(props.id);
                            }}
                        />
                    </div>
                )}
            </div>
        </motion.div>
    );
}
