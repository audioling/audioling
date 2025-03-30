import type { PlayQueueItem, TrackItem } from '/@/app-types';
import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { localize } from '@repo/localization';
import { ServerItemType } from '@repo/shared-types/app-types';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';
import { useCurrentTrack } from '/@/stores/player-store';

function Cell(props: ItemListCellProps) {
    const { item, itemType } = props;

    if (!item) {
        return <CellSkeleton height={20} width={100} />;
    }

    switch (itemType) {
        case ServerItemType.TRACK:
        case ServerItemType.PLAYLIST_TRACK:
            return <TrackCell {...props} />;
        case ServerItemType.QUEUE_TRACK:
            return <QueueTrackCell {...props} />;
        default:
            return <DefaultCell {...props} />;
    }
}

function DefaultCell(props: ItemListCellProps) {
    const { item } = props;

    if (typeof item === 'object' && item) {
        if ('name' in item && typeof item.name === 'string') {
            return (
                <ItemCell lineClamp={2} {...props}>
                    {item.name}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

function TrackCell({ item }: ItemListCellProps) {
    const { track } = useCurrentTrack();
    const cellItem = item as TrackItem | undefined;
    const isPlaying = track !== undefined && cellItem?.id === track?.id;

    if (typeof item === 'object' && item) {
        if ('name' in item && typeof item.name === 'string') {
            return (
                <ItemCell>
                    {item.name}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

function QueueTrackCell({ item }: ItemListCellProps) {
    const { track } = useCurrentTrack();
    const cellItem = item as PlayQueueItem | undefined;
    const isPlaying = track !== undefined && cellItem?._uniqueId === track?._uniqueId;

    if (typeof item === 'object' && item) {
        if ('name' in item && typeof item.name === 'string') {
            return (
                <ItemCell>
                    {item.name}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const nameColumn = {
    cell: Cell,
    header: () => <HeaderCell>{localize.t('app.itemList.columns.name', { context: 'label' })}</HeaderCell>,
    id: 'name' as ItemListColumn.NAME,
    size: numberToColumnSize(1, 'fr'),
};
