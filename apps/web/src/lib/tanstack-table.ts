/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LibraryItemType } from '@repo/shared-types';
import type { RowData } from '@tanstack/react-table';
import type { PlayQueueItem } from '@/api/api-types.ts';

declare module '@tanstack/react-table' {
    interface CellContext<TData extends RowData, TValue> {
        context: {
            currentTrack?: PlayQueueItem;
            data?: unknown;
            isHovered?: boolean;
            itemType?: LibraryItemType;
            libraryId: string;
            listKey: string;
            startIndex?: number;
        };
    }
}
