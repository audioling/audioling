import type { PlayQueueItem } from '/@/app-types';
import { useCallback } from 'react';
import { ContextMenu } from '/@/components/context-menu/context-menu';
import { PlayerController } from '../../../../controllers/player-controller';

interface QueueMoveProps {
    items: PlayQueueItem[];
}

export function QueueMove({ items }: QueueMoveProps) {
    const onSelectTop = useCallback(() => {
        PlayerController.call({
            cmd: {
                moveSelectedToTop: {
                    items,
                },
            },
        });
    }, [items]);

    const onSelectBottom = useCallback(() => {
        PlayerController.call({
            cmd: {
                moveSelectedToBottom: {
                    items,
                },
            },
        });
    }, [items]);

    const onSelectNext = useCallback(() => {
        PlayerController.call({
            cmd: {
                moveSelectedToNext: {
                    items,
                },
            },
        });
    }, [items]);

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
