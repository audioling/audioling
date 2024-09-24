import { useState } from 'react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { ColumnDef, FilterFn, SortingState } from '@tanstack/react-table';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

interface UseEntityTableProps<T> {
    columns: ColumnDef<T, string>[];
    data: {
        rows: T[];
        setRows: (items: T[]) => void;
    };
    options: {
        draggable?: {
            enabled?: boolean;
            onDragCancel?: () => void;
            onDragEnd?: (args: DragEndEvent) => void;
            onDragStart?: (args: DragStartEvent) => void;
        };
        globalFilter?: FilterFn<T>;
        isColumnAutoSize?: boolean;
        isColumnResizable?: boolean;
        isMultiRowSelection?: boolean;
        isSingleRowSelection?: boolean;
        isTableHeaderDisabled?: boolean;
        tableHeight?: number;
        tableRowHeight?: number;
        tableWidth?: number;
    };
    tableId: string;
}

export const useEntityTable = <T extends { id: string }>(props: UseEntityTableProps<T>) => {
    const { columns, data, options, tableId } = props;
    const { rows } = data;

    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable<T>({
        columns,
        data: rows,
        enableColumnResizing: options.isColumnResizable,
        enableMultiRowSelection: options.isMultiRowSelection,
        enableRowSelection: options.isSingleRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getRowId: (row) => row.id,
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    });

    const outProps = {
        autoSizeColumns: options.isColumnAutoSize,
        data,
        disableTableHeader: options.isTableHeaderDisabled,
        draggable: options.draggable,
        multiRowSelection: options.isMultiRowSelection,
        rowHeight: options.tableRowHeight,
        singleRowSelection: options.isSingleRowSelection,
        table,
        tableHeight: options.tableHeight,
        tableId,
        tableWidth: options.tableWidth,
    };

    return outProps;
};
