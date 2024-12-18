import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import { Card, type CardProps } from '@/features/ui/card/card.tsx';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';

interface AlbumCardProps extends Omit<CardProps, 'controls'> {}

export function AlbumCard(props: AlbumCardProps) {
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
                    type: DragTarget.ALBUM,
                },
                { image, title: titledata.text },
            );
        },
        onDragStart: () => {
            PrefetchController.call({
                cmd: {
                    tracksByAlbumId: {
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
                        itemType: LibraryItemType.ALBUM,
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
