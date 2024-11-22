import type { Table } from '@tanstack/react-table';
import type { PlayQueueItem } from '@/api/api-types.ts';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

interface QueueRemoveProps {
    table: Table<PlayQueueItem | undefined>;
}

export function QueueRemove({ table }: QueueRemoveProps) {
    const onSelect = () => {
        const items = table
            .getSelectedRowModel()
            .rows.map((row) => row.original)
            .filter((item): item is PlayQueueItem => item !== undefined);

        PlayerController.call({
            cmd: {
                clearSelected: {
                    items,
                },
            },
        });

        table.resetRowSelection();
    };

    return <ContextMenu.Item onSelect={onSelect}>Remove selected</ContextMenu.Item>;
}
