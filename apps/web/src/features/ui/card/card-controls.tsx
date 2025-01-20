import type { LibraryItemType } from '@repo/shared-types';
import { motion } from 'motion/react';
import { PlayType } from '@/features/player/stores/player-store.tsx';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { IconButton, IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';
import styles from './card-controls.module.scss';

interface CardControlsProps {
    id: string;
    itemType: LibraryItemType;
    libraryId: string;
    onFavorite?: (id: string, libraryId: string) => void;
    onMore?: (id: string) => void;
    onPlay: (id: string, playType: PlayType) => void;
    onUnfavorite?: (id: string, libraryId: string) => void;
    userFavorite?: boolean;
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
                    {props.onFavorite && props.onUnfavorite && (
                        <IconButtonWithTooltip
                            isCompact
                            icon={props.userFavorite ? 'unfavorite' : 'favorite'}
                            iconFill={props.userFavorite}
                            iconProps={{
                                state: props.userFavorite ? 'primary' : undefined,
                            }}
                            size="lg"
                            tooltipProps={{
                                label: props.userFavorite
                                    ? 'Remove from favorites'
                                    : 'Add to favorites',
                                openDelay: 500,
                            }}
                            variant="transparent"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (props.userFavorite) {
                                    props.onUnfavorite?.(props.id, props.libraryId);
                                } else {
                                    props.onFavorite?.(props.id, props.libraryId);
                                }
                            }}
                        />
                    )}
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
