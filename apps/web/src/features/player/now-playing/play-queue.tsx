import { useEffect, useMemo, useState } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useParams } from 'react-router-dom';
import type { PlayQueueItem } from '@/api/api-types.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { subscribePlayerQueue, usePlayerActions } from '@/features/player/stores/player-store.tsx';
import { ItemListColumn, type ItemListColumnOrder } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import type { ItemTableRowDrop } from '@/features/ui/item-list/item-table/item-table.tsx';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import { DragOperation, DragTarget } from '@/utils/drag-drop.ts';

interface PlayQueueTableItemContext {
    baseUrl: string;
    libraryId: string;
}

export function PlayQueue() {
    const baseUrl = useAuthBaseUrl();
    const { libraryId } = useParams() as { libraryId: string };

    const { getQueue } = usePlayerActions();

    useEffect(() => {
        const setQueue = () => {
            const queue = getQueue();

            setData(() => {
                const newData = new Map();
                queue.items.forEach((item, index) => {
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
        ItemListColumn.ROW_INDEX,
        ItemListColumn.DURATION,
        ItemListColumn.NAME,
        ItemListColumn.ALBUM,
        ItemListColumn.ARTISTS,
    ]);

    const { columns } = useItemTable<PlayQueueItem>(columnOrder, setColumnOrder);

    const onRowDrop = (args: ItemTableRowDrop<PlayQueueItem>) => {
        const { edge, data } = args;

        // TODO: Handle reorder operations
        if (data.operation?.includes(DragOperation.ADD)) {
            switch (data.type) {
                case DragTarget.ALBUM:
                    PlayerController.call({
                        cmd: {
                            addToQueueByFetch: {
                                id: data.id,
                                itemType: LibraryItemType.ALBUM,
                                type: {
                                    edge,
                                    uniqueId: data.id,
                                },
                            },
                        },
                    });

                    break;
                // case DragTarget.TRACK:
                //     PlayerController.call({
                //         cmd: {
                //             addToQueueByData: {
                //                 data: [],
                //                 type: {
                //                     edge,
                //                     uniqueId: data.id,
                //                 },
                //             },
                //         },
                //     });
                //     break;
            }
        }
    };

    return (
        <ItemTable<PlayQueueItem, PlayQueueTableItemContext>
            columnOrder={columnOrder}
            columns={columns}
            context={tableContext}
            data={data}
            itemCount={data.size}
            itemType={LibraryItemType.TRACK}
            onChangeColumnOrder={setColumnOrder}
            onRowDrop={onRowDrop}
        />
    );
}
