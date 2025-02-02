import type { PlayQueueItem } from '@/api/api-types.ts';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

interface QueueRemoveProps {
    items: PlayQueueItem[];
}

export function QueueRemove({ items }: QueueRemoveProps) {
    const onSelect = () => {
        PlayerController.call({
            cmd: {
                clearSelected: {
                    items,
                },
            },
        });
    };

    return (
        <ContextMenu.Item leftIcon="remove" onSelect={onSelect}>
            Remove selected
        </ContextMenu.Item>
    );
}
