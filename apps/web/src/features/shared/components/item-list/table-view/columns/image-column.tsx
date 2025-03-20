import type {
    AlbumArtistItem,
    AlbumItem,
    ArtistItem,
    GenreItem,
    PlaylistItem,
    PlayQueueItem,
    TrackItem,
} from '/@/app-types';
import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import type { MouseEvent } from 'react';
import { ActionIcon } from '@mantine/core';
import { ServerItemType } from '@repo/shared-types/app-types';
import Skeleton from 'react-loading-skeleton';
import styles from './column.module.css';
import { Icon } from '/@/components/icon/icon';
import { PlayerController } from '/@/controllers/player-controller';
import { ItemImage } from '/@/features/shared/components/item-image/item-image';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';
import { PlayType } from '/@/stores/player-store';

const playButtonOmittedItemTypes = [ServerItemType.PLAYLIST_TRACK];

function Cell({ isHovered, item, itemType }: ItemListCellProps) {
    if (typeof item === 'object' && item) {
        if ('imageUrl' in item) {
            const handlePlay = (e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();

                switch (itemType) {
                    case ServerItemType.ALBUM:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: [(item as AlbumItem).id],
                                    itemType,
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
                    case ServerItemType.ALBUM_ARTIST:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: [(item as AlbumArtistItem).id],
                                    itemType,
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
                    case ServerItemType.ARTIST:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: [(item as ArtistItem).id],
                                    itemType,
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
                    case ServerItemType.GENRE:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: [(item as unknown as GenreItem).id],
                                    itemType,
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
                    case ServerItemType.PLAYLIST:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: [(item as PlaylistItem).id],
                                    itemType,
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
                    case ServerItemType.PLAYLIST_TRACK:
                        break;
                    case ServerItemType.TRACK:
                        PlayerController.call({
                            cmd: {
                                addToQueueByData: {
                                    data: [item as TrackItem],
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
                    case ServerItemType.QUEUE_TRACK:
                        PlayerController.call({
                            cmd: {
                                mediaPlay: { id: (item as PlayQueueItem)._uniqueId },
                            },
                        });
                        break;
                }
            };

            return (
                <div className={styles.imageCell}>
                    <ItemImage
                        className={styles.image}
                        size="table"
                        src={item.imageUrl as string | string[]}
                    />
                    {isHovered && !playButtonOmittedItemTypes.includes(itemType) && (
                        <ActionIcon
                            className={styles.playButton}
                            size="xs"
                            variant="filled"
                            onClick={handlePlay}
                        >
                            <Icon fill="primary" icon="mediaPlay" />
                        </ActionIcon>
                    )}
                </div>
            );
        }
    }

    return (
        <div className={styles.imageCell}>
            <Skeleton
                className={styles.skeletonImage}
                containerClassName={styles.skeletonImageContainer}
            />
        </div>
    );
}

export const imageColumn = {
    cell: Cell,
    header: () => '',
    id: 'image' as ItemListColumn.IMAGE,
    size: numberToColumnSize(60, 'px'),
};
