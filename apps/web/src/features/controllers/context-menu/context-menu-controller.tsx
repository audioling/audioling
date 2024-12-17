import type { MouseEvent } from 'react';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Table } from '@tanstack/react-table';
import { createCallable } from 'react-call';
import { useParams } from 'react-router';
import type { PlayQueueItem } from '@/api/api-types.ts';
import { QueueContextMenu } from '@/features/controllers/context-menu/queue-context-menu.tsx';
import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

interface ContextMenuControllerProps {
    cmd: ContextMenuCommand;
    event: MouseEvent;
}

export const ContextMenuController = createCallable<ContextMenuControllerProps, void>(
    ({ call, cmd, event }) => {
        const { libraryId } = useParams() as { libraryId: string };
        const queryClient = useQueryClient();

        const triggerRef = useRef<HTMLDivElement>(null);
        const isExecuted = useRef<boolean>(false);

        useEffect(() => {
            if (isExecuted.current) {
                return;
            }

            if (!triggerRef.current) {
                return;
            }

            const handleContextMenu = () => {
                triggerRef.current?.dispatchEvent(
                    new MouseEvent('contextmenu', {
                        bubbles: true,
                        clientX: event.clientX,
                        clientY: event.clientY,
                    }),
                );
            };

            isExecuted.current = true;

            handleContextMenu();
        }, [call, cmd, event.clientX, event.clientY, libraryId, queryClient]);

        return (
            <ContextMenu>
                <ContextMenu.Target>
                    <div
                        ref={triggerRef}
                        style={{
                            height: 0,
                            left: 0,
                            pointerEvents: 'none',
                            position: 'absolute',
                            top: 0,
                            userSelect: 'none',
                            width: 0,
                        }}
                    />
                </ContextMenu.Target>
                {cmd.type === 'queue' && <QueueContextMenu table={cmd.table} />}
            </ContextMenu>
        );
    },
);

export type ContextMenuCommand = Queue;

type Queue = {
    table: Table<PlayQueueItem | undefined>;
    type: 'queue';
};
