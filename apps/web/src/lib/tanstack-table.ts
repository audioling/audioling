/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
    interface CellContext<TData extends RowData, TValue> {
        context: {
            baseUrl: string;
            libraryId: string;
        };
    }
}
