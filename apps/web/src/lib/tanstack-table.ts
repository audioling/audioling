/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RowData } from '@tanstack/react-table';
import type { PlayQueueItem } from '@/api/api-types.ts';

declare module '@tanstack/react-table' {
    interface CellContext<TData extends RowData, TValue> {
        context: {
            baseUrl: string;
            currentTrack: PlayQueueItem | undefined;
            libraryId: string;
        };
    }
}
