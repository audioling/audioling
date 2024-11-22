import { useCallback } from 'react';
import type { Table } from '@tanstack/react-table';
import type { PlayQueueItem } from '@/api/api-types.ts';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

interface QueueMoveProps {
    table: Table<PlayQueueItem | undefined>;
}

export function QueueMove({ table }: QueueMoveProps) {
    const onSelectTop = useCallback(() => {
        const rows = table.getSelectedRowModel().rows;

        PlayerController.call({
            cmd: {
                moveSelectedToTop: {
                    items: rows
                        .map((row) => row.original)
                        .filter((item): item is PlayQueueItem => item !== undefined),
                },
            },
        });
    }, [table]);

    const onSelectBottom = useCallback(() => {
        const rows = table.getSelectedRowModel().rows;

        PlayerController.call({
            cmd: {
                moveSelectedToBottom: {
                    items: rows
                        .map((row) => row.original)
                        .filter((item): item is PlayQueueItem => item !== undefined),
                },
            },
        });
    }, [table]);

    const onSelectNext = useCallback(() => {
        const rows = table.getSelectedRowModel().rows;

        PlayerController.call({
            cmd: {
                moveSelectedToNext: {
                    items: rows
                        .map((row) => row.original)
                        .filter((item): item is PlayQueueItem => item !== undefined),
                },
            },
        });
    }, [table]);

    return (
        <>
            <ContextMenu.Submenu>
                <ContextMenu.SubmenuTarget>
                    <ContextMenu.Item rightIcon="arrowRightS">Move to</ContextMenu.Item>
                </ContextMenu.SubmenuTarget>
                <ContextMenu.SubmenuContent>
                    <ContextMenu.Item leftIcon="arrowRight" onSelect={onSelectNext}>
                        Next
                    </ContextMenu.Item>
                    <ContextMenu.Item leftIcon="arrowUpToLine" onSelect={onSelectTop}>
                        Top
                    </ContextMenu.Item>
                    <ContextMenu.Item leftIcon="arrowDownToLine" onSelect={onSelectBottom}>
                        Bottom
                    </ContextMenu.Item>
                </ContextMenu.SubmenuContent>
            </ContextMenu.Submenu>
        </>
    );
}
