import { useEffect, useMemo, useState } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useParams } from 'react-router-dom';
import type { PlayQueueItem, TrackItem } from '@/api/api-types.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import {
    PlayType,
    subscribePlayerQueue,
    useAddToQueue,
    usePlayerActions,
} from '@/features/player/stores/player-store.tsx';
import { ItemListColumn, type ItemListColumnOrder } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import type { ItemTableRowDrop } from '@/features/ui/item-list/item-table/item-table.tsx';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import { DragOperation, DragTarget } from '@/utils/drag-drop.ts';

interface SidePlayQueueTableItemContext {
    baseUrl: string;
    libraryId: string;
}

export function SidePlayQueue() {
    const baseUrl = useAuthBaseUrl();
    const { libraryId } = useParams() as { libraryId: string };

    const { getQueue } = usePlayerActions();

    useEffect(() => {
        const setQueue = () => {
            const queue = getQueue();

            setData(() => {
                const newData = new Map();
                queue.all.forEach((item, index) => {
                    newData.set(index, item);
                });
                return newData;
            });
        };

        const unsub = subscribePlayerQueue(() => {
            setQueue();
        });

        setQueue();

        return () => unsub();
    }, [getQueue]);

    const [data, setData] = useState<Map<number, PlayQueueItem>>(new Map());

    const tableContext = useMemo(() => ({ baseUrl, libraryId }), [baseUrl, libraryId]);

    const [columnOrder, setColumnOrder] = useState<ItemListColumnOrder>([
        ItemListColumn.STANDALONE_COMBINED,
    ]);

    const { columns } = useItemTable<TrackItem>(columnOrder, setColumnOrder);

    const { onPlayByFetch } = useAddToQueue({ libraryId });
    const onRowDrop = (args: ItemTableRowDrop) => {
        const { index, edge, data } = args;

        const insertIndex = Math.max(0, edge === 'top' ? index : index + 1);

        // TODO: Handle reorder operations
        if (data.operation?.includes(DragOperation.ADD)) {
            switch (data.type) {
                case DragTarget.ALBUM:
                    onPlayByFetch({
                        id: data.id,
                        index: insertIndex,
                        itemType: LibraryItemType.ALBUM,
                        playType: PlayType.INDEX,
                    });
                    break;
                case DragTarget.TRACK:
                    onPlayByFetch({
                        id: data.id,
                        index: insertIndex,
                        itemType: LibraryItemType.TRACK,
                        playType: PlayType.INDEX,
                    });
                    break;
            }
        }
    };

    return (
        <ItemTable<TrackItem, SidePlayQueueTableItemContext>
            columnOrder={columnOrder}
            columns={columns}
            context={tableContext}
            data={data}
            isHeaderVisible={false}
            itemCount={data.size}
            itemType={LibraryItemType.TRACK}
            onChangeColumnOrder={setColumnOrder}
            onRowDrop={onRowDrop}
        />
    );
}
