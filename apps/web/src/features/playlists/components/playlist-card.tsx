import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import { Card, type CardProps } from '@/features/ui/card/card.tsx';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';

interface PlaylistCardProps extends Omit<CardProps, 'controls'> {}

export function PlaylistCard(props: PlaylistCardProps) {
    const {
        id,
        image,
        libraryId,
        componentState,
        metadata,
        metadataLines = 1,
        titledata,
        className,
        ...htmlProps
    } = props;

    const controls: CardProps['controls'] = {
        onDragInitialData: () => {
            return dndUtils.generateDragData(
                {
                    id: [id],
                    operation: [DragOperation.ADD],
                    type: DragTarget.PLAYLIST,
                },
                { image, title: titledata.text },
            );
        },
        onDragStart: () => {
            PrefetchController.call({
                cmd: {
                    tracksByPlaylistId: {
                        id: [id],
                        params: {
                            sortBy: TrackListSortOptions.ID,
                            sortOrder: ListSortOrder.ASC,
                        },
                    },
                },
            });
        },
        onPlay: (id, playType) => {
            PlayerController.call({
                cmd: {
                    addToQueueByFetch: {
                        id: [id],
                        itemType: LibraryItemType.PLAYLIST,
                        type: playType,
                    },
                },
            });
        },
    };

    return (
        <Card
            className={className}
            componentState={componentState}
            controls={controls}
            id={id}
            image={image}
            libraryId={libraryId}
            metadata={metadata}
            metadataLines={metadataLines}
            titledata={titledata}
            {...htmlProps}
        />
    );
}
