import type { ItemListInternalState } from '/@/features/shared/components/item-list/utils/helpers';
import type { MouseEvent } from 'react';
import { ActionIcon } from '@mantine/core';
import { motion } from 'motion/react';
import styles from './item-card-controls.module.css';
import { animationVariants } from '/@/components/animations/variants';
import { Icon } from '/@/components/icon/icon';
import { PlayType } from '/@/stores/player-store';

interface ItemCardControlsProps {
    id: string;
    onContextMenu?: (
        item: { id: string; serverId: string },
        event: MouseEvent<HTMLButtonElement>,
        reducers?: ItemListInternalState['reducers'],
    ) => void;
    onFavorite?: (item: { id: string; serverId: string }) => void;
    onPlay?: (item: { id: string; serverId: string }, playType: PlayType) => void;
    onUnfavorite?: (item: { id: string; serverId: string }) => void;
    reducers?: ItemListInternalState['reducers'];
    serverId: string;
    userFavorite: boolean | null;
}

export function ItemCardControls({
    id,
    onContextMenu,
    onFavorite,
    onPlay,
    onUnfavorite,
    reducers,
    serverId,
    userFavorite,
}: ItemCardControlsProps) {
    const handleFavorite = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (userFavorite) {
            onUnfavorite?.({ id, serverId });
        }
        else {
            onFavorite?.({ id, serverId });
        }
    };

    const handlePlay = (e: MouseEvent<HTMLButtonElement>, playType: PlayType) => {
        e.stopPropagation();
        onPlay?.({ id, serverId }, playType);
    };

    const handleContextMenu = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onContextMenu?.({ id, serverId }, e, reducers);
    };

    return (
        <motion.div
            animate="show"
            className={styles.cardControls}
            initial="hidden"
            variants={animationVariants.fadeIn}
        >
            <div className={styles.top}>
                <div className={styles.topLeft} />
                <div className={styles.topRight}>
                    {onFavorite && onUnfavorite && (
                        <ActionIcon
                            size="xs"
                            variant="transparent"
                            onClick={handleFavorite}
                        >
                            <Icon
                                fill={userFavorite ? 'secondary' : undefined}
                                icon={userFavorite ? 'unfavorite' : 'favorite'}
                            />
                        </ActionIcon>
                    )}
                </div>
            </div>
            <div className={styles.center}>
                {onPlay && (
                    <ActionIcon
                        className={styles.playButton}
                        variant="filled"
                        onClick={e => handlePlay(e, PlayType.NOW)}
                    >
                        <Icon fill="inherit" icon="mediaPlay" />
                    </ActionIcon>
                )}
            </div>
            <div className={styles.bottom}>
                <div className={styles.bottomLeft}>
                    {onPlay && (
                        <>
                            <ActionIcon
                                radius="sm"
                                size="xs"
                                variant="filled"
                                onClick={e => handlePlay(e, PlayType.NEXT)}
                            >
                                <Icon icon="arrowRightS" size="sm" />
                            </ActionIcon>
                            <ActionIcon
                                radius="sm"
                                size="xs"
                                variant="filled"
                                onClick={e => handlePlay(e, PlayType.LAST)}
                            >
                                <Icon icon="arrowRightLast" size="sm" />
                            </ActionIcon>
                        </>
                    )}
                </div>
                <div className={styles.bottomRight}>
                    {onContextMenu && (
                        <ActionIcon
                            size="xs"
                            variant="transparent"
                            onClick={handleContextMenu}
                        >
                            <Icon icon="ellipsisHorizontal" size="sm" />
                        </ActionIcon>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
