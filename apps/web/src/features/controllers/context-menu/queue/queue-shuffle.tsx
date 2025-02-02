import type { PlayQueueItem } from '@/api/api-types.ts';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

interface QueueShuffleProps {
    items: PlayQueueItem[];
}

export function QueueShuffle({ items }: QueueShuffleProps) {
    const handleShuffle = () => {
        PlayerController.call({ cmd: { shuffle: null } });
    };

    const handleShuffleSelected = () => {
        PlayerController.call({
            cmd: {
                shuffleSelected: {
                    items,
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
