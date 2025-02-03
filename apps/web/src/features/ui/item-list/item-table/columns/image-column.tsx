import type { MouseEvent } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import type {
    AlbumArtistItem,
    AlbumItem,
    ArtistItem,
    GenreItem,
    PlaylistItem,
    PlayQueueItem,
    TrackItem,
} from '@/api/api-types.ts';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { PlayType } from '@/features/player/stores/player-store.tsx';
import { ItemImage } from '@/features/shared/item-image/item-image.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import styles from './column.module.scss';

const playButtonOmittedItemTypes = [LibraryItemType.PLAYLIST_TRACK];

function Cell({ item, itemType, isHovered }: ItemListCellProps) {
    if (typeof item === 'object' && item) {
        if ('imageUrl' in item) {
            const handlePlay = (e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();

                switch (itemType) {
                    case LibraryItemType.ALBUM:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: [(item as AlbumItem).id],
                                    itemType: itemType,
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
                    case LibraryItemType.ALBUM_ARTIST:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: [(item as AlbumArtistItem).id],
                                    itemType: itemType,
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
                    case LibraryItemType.ARTIST:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: [(item as ArtistItem).id],
                                    itemType: itemType,
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
                    case LibraryItemType.GENRE:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: [(item as unknown as GenreItem).id],
                                    itemType: itemType,
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
                    case LibraryItemType.PLAYLIST:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: [(item as PlaylistItem).id],
                                    itemType: itemType,
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
                    case LibraryItemType.PLAYLIST_TRACK:
                        break;
                    case LibraryItemType.TRACK:
                        PlayerController.call({
                            cmd: {
                                addToQueueByData: {
                                    data: [item as TrackItem],
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
                    case LibraryItemType.QUEUE_TRACK:
                        PlayerController.call({
                            cmd: {
                                mediaPlay: { id: (item as PlayQueueItem)._uniqueId },
                            },
                        });
                        break;
                }
            };

            return (
                <div className={styles.cell}>
                    <ItemImage
                        className={styles.image}
                        size="table"
                        src={item.imageUrl as string | string[]}
                    />
                    {isHovered && !playButtonOmittedItemTypes.includes(itemType) && (
                        <IconButton
                            iconFill
                            className={styles.playButton}
                            icon="mediaPlay"
                            size="xs"
                            variant="filled"
                            onClick={handlePlay}
                        />
                    )}
                </div>
            );
        }
    }

    return (
        <div className={styles.cell}>
            <Skeleton containerClassName={styles.skeletonImage} height="100%" />
        </div>
    );
}

export const imageColumn = {
    cell: Cell,
    header: () => '',
    id: 'image' as ItemListColumn.IMAGE,
    size: numberToColumnSize(60, 'px'),
};
