import { QueueAddToPlaylist } from '@/features/controllers/context-menu/queue/queue-add-to-playlist.tsx';
import { QueueCache } from '@/features/controllers/context-menu/queue/queue-cache.tsx';
import { QueueDownload } from '@/features/controllers/context-menu/queue/queue-download.tsx';
import { QueueInfo } from '@/features/controllers/context-menu/queue/queue-info.tsx';
import { QueueMove } from '@/features/controllers/context-menu/queue/queue-move.tsx';
import { QueueRemove } from '@/features/controllers/context-menu/queue/queue-remove.tsx';
import { QueueSetItem } from '@/features/controllers/context-menu/queue/queue-set-item.tsx';
import { QueueShare } from '@/features/controllers/context-menu/queue/queue-share.tsx';
import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';
import { Divider } from '@/features/ui/divider/divider.tsx';

export function QueueContextMenu() {
    return (
        <ContextMenu.Content>
            <QueueRemove />
            <Divider />
            <QueueMove />
            <Divider />
            <QueueAddToPlaylist />
            <QueueSetItem />
            <Divider />
            <QueueDownload />
            <QueueCache />
            <Divider />
            <QueueShare />
            <Divider />
            <QueueInfo />
        </ContextMenu.Content>
    );
}
