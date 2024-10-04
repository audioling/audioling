import { useMemo } from 'react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { ColumnDef, Table } from '@tanstack/react-table';
import { VirtualDraggableEntityTableContent } from '@/features/ui/entity-table/entity-table-content.tsx';
import { EntityTableHeader } from '@/features/ui/entity-table/entity-table-header.tsx';
import styles from './entity-table.module.scss';
import type { useDnd } from '../dnd/hooks/use-dnd';

export interface EntityTableVirtualProps<T> {
    data: {
        rows: T[];
        setRows: (items: T[]) => void;
    };
    dndProps?: ReturnType<typeof useDnd>;
    onRowDragEnd?: (args: DragEndEvent) => void;
    onRowDragStart?: (args: DragStartEvent) => void;
    table: Table<T>;
    tableHeight?: number;
    tableId: string;
    tableRowHeight?: number;
    tableWidth?: number;
}

export interface ListWrapperProps<T> {
    columns: ColumnDef<T, string>[];
}

export const EntityTableVirtual = <T extends { id: string }>(props: EntityTableVirtualProps<T>) => {
    const { data, dndProps, table, tableId, onRowDragEnd, onRowDragStart } = props;

    const tableColumns = table.getAllColumns();

    const { headerColumnStyles, rowColumnStyles } = useMemo(() => {
        const headerColumnSizes: string[] = [];
        const rowColumnSizes: string[] = [];

        tableColumns.forEach((col, index) => {
            if (!col.getIsVisible()) {
                return;
            }

            const isLastColumn = index === tableColumns.length - 1;
            const dividerSize = 1;

            // 9007199254740991 is the default max size for a column in react-table
            if (col.columnDef.maxSize !== 9007199254740991) {
                const rowColumnSize = isLastColumn
                    ? col.columnDef.maxSize
                    : (col.columnDef.maxSize || 0) + dividerSize;

                headerColumnSizes.push(`minmax(0, ${col.columnDef.maxSize}px)`);
                rowColumnSizes.push(`minmax(0, ${rowColumnSize}px)`);

                if (!isLastColumn) {
                    headerColumnSizes.push(`${dividerSize}px`);
                }
            } else if (col.columnDef.size !== 0) {
                const rowColumnMinSize = isLastColumn
                    ? col.columnDef.minSize
                    : (col.columnDef.minSize || 0) + dividerSize;
                const rowColumnSize = isLastColumn
                    ? col.columnDef.size
                    : (col.columnDef.size || 150) + dividerSize;

                headerColumnSizes.push(
                    `minmax(${col.columnDef.minSize}px, ${col.columnDef.size || 150}fr)`,
                );
                rowColumnSizes.push(`minmax(${rowColumnMinSize}px, ${rowColumnSize}fr)`);

                if (!isLastColumn) {
                    headerColumnSizes.push(`${dividerSize}px`);
                }
            }
        });

        const headerColumnStyles = {
            display: 'grid',
            gridTemplateColumns: headerColumnSizes.join(' '),
            width: '100%',
        };

        const rowColumnStyles = {
            display: 'grid',
            gridTemplateColumns: rowColumnSizes.join(' '),
            width: '100%',
        };

        return {
            headerColumnStyles,
            rowColumnStyles,
        };
    }, [tableColumns]);

    return (
        <div className={styles.listContainer}>
            <EntityTableHeader
                headerColumnStyles={headerColumnStyles}
                table={table}
                tableId={tableId}
            />
            <VirtualDraggableEntityTableContent
                data={data}
                dndProps={dndProps}
                rowColumnStyles={rowColumnStyles}
                table={table}
                tableId={tableId}
            />
        </div>
    );
};
