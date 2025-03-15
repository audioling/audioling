import type { PlayQueueItem } from '/@/app-types';
import { ContextMenu } from '/@/components/context-menu/context-menu';
import { PlayerController } from '../../../../controllers/player-controller';

interface QueueShuffleProps {
    items: PlayQueueItem[];
}

export function QueueShuffle({ items }: QueueShuffleProps) {
    const handleShuffle = () => {
        PlayerController.call({ cmd: { shuffleAll: null } });
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
