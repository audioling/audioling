import type { Table } from '@tanstack/react-table';
import type { PlayQueueItem } from '@/api/api-types.ts';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

interface QueueShuffleProps {
    table: Table<PlayQueueItem | undefined>;
}

export function QueueShuffle({ table }: QueueShuffleProps) {
    const handleShuffle = () => {
        PlayerController.call({ cmd: { shuffle: null } });
    };

    const handleShuffleSelected = () => {
        const rows = table.getSelectedRowModel().rows;

        PlayerController.call({
            cmd: {
                shuffleSelected: {
                    items: rows
                        .map((row) => row.original)
                        .filter((item): item is PlayQueueItem => item !== undefined),
                },
            },
        });
    };

    return (
        <>
            <ContextMenu.Submenu>
                <ContextMenu.SubmenuTarget>
                    <ContextMenu.Item rightIcon="arrowRightS">Shuffle</ContextMenu.Item>
                </ContextMenu.SubmenuTarget>
                <ContextMenu.SubmenuContent>
                    <ContextMenu.Item onSelect={handleShuffleSelected}>Selected</ContextMenu.Item>
                    <ContextMenu.Item onSelect={handleShuffle}>All</ContextMenu.Item>
                </ContextMenu.SubmenuContent>
            </ContextMenu.Submenu>
        </>
    );
}
