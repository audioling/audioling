import type { PlayQueueItem, TrackItem } from '/@/app-types';
import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { ActionIcon } from '@mantine/core';
import { ServerItemType } from '@repo/shared-types/app-types';
import { Icon } from '/@/components/icon/icon';
import { SoundBars } from '/@/components/sound-bars/sound-bars';
import { PlayerController } from '/@/controllers/player-controller';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';
import { PlayerStatus, useCurrentTrack, usePlayerStatus } from '/@/stores/player-store';

function Cell(props: ItemListCellProps) {
    const { itemType } = props;

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

function DefaultCell({ index, startIndex }: ItemListCellProps) {
    return (
        <ItemCell isSecondary justify="center">
            {index + (startIndex ?? 0) + 1}
            {' '}
        </ItemCell>
    );
}

function TrackCell({ index, item, startIndex }: ItemListCellProps) {
    const { track } = useCurrentTrack();
    const cellItem = item as TrackItem | undefined;
    const isPlaying = track !== undefined && cellItem?.id === track?.id;

    return (
        <ItemCell isSecondary justify="center">
            {index + (startIndex ?? 0) + 1}
        </ItemCell>
    );
}

function QueueTrackCell({ index, isHovered, item }: ItemListCellProps) {
    const { track } = useCurrentTrack();
    const cellItem = item as PlayQueueItem | undefined;
    const isPlaying = track !== undefined && cellItem?._uniqueId === track?._uniqueId;
    const status = usePlayerStatus();

    if (isHovered) {
        const handleRemove = () => {
            if (!cellItem) {
                return;
            }

            PlayerController.call({
                cmd: {
                    clearSelected: {
                        items: [cellItem],
                    },
                },
            });
        };

        return (
            <ItemCell justify="center">
                <ActionIcon
                    size="lg"
                    variant="transparent"
                    onClick={handleRemove}
                >
                    <Icon icon="remove" />
                </ActionIcon>
            </ItemCell>
        );
    }

    return (
        <ItemCell isSecondary justify="center">
            {!isPlaying ? index + 1 : <SoundBars isPlaying={status === PlayerStatus.PLAYING} />}
        </ItemCell>
    );
}

export const rowIndexColumn = {
    cell: Cell,
    header: () => (
        <HeaderCell justify="center">
            <Icon icon="hash" />
        </HeaderCell>
    ),
    id: 'rowIndex' as ItemListColumn.ROW_INDEX,
    size: numberToColumnSize(60, 'px'),
};
