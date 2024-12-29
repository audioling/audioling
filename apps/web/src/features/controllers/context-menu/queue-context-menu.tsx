import type { Table } from '@tanstack/react-table';
import type { PlayQueueItem } from '@/api/api-types.ts';
import { QueueAddToPlaylist } from '@/features/controllers/context-menu/queue/queue-add-to-playlist.tsx';
import { QueueCache } from '@/features/controllers/context-menu/queue/queue-cache.tsx';
import { QueueDownload } from '@/features/controllers/context-menu/queue/queue-download.tsx';
import { QueueInfo } from '@/features/controllers/context-menu/queue/queue-info.tsx';
import { QueueMove } from '@/features/controllers/context-menu/queue/queue-move.tsx';
import { QueueRemove } from '@/features/controllers/context-menu/queue/queue-remove.tsx';
import { QueueSetItem } from '@/features/controllers/context-menu/queue/queue-set-item.tsx';
import { QueueShare } from '@/features/controllers/context-menu/queue/queue-share.tsx';
import { QueueShuffle } from '@/features/controllers/context-menu/queue/queue-shuffle.tsx';
import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';
import { Divider } from '@/features/ui/divider/divider.tsx';

interface QueueContextMenuProps {
    table: Table<PlayQueueItem | undefined>;
}

export function QueueContextMenu({ table }: QueueContextMenuProps) {
    return (
        <ContextMenu.Content>
            <QueueRemove table={table} />
            <QueueShuffle table={table} />
            <Divider />
            <QueueMove table={table} />
            <Divider />
            <QueueAddToPlaylist table={table} />
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
