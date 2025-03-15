import type { PlayQueueItem } from '/@/app-types';
import { ContextMenu } from '/@/components/context-menu/context-menu';
import { PlayerController } from '../../../../controllers/player-controller';

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
