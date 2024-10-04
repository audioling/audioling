import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { DndContext, useDndMonitor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Row, Table } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { createPortal } from 'react-dom';
import type { useDnd } from '@/features/ui/dnd/hooks/use-dnd.tsx';
import { EntityTableRowDragOverlay } from '@/features/ui/entity-table/entity-table-row-drag-overlay.tsx';
import {
    DraggableEntityTableRow,
    EntityTableRow,
} from '@/features/ui/entity-table/entity-table-row.tsx';
import { getRowRange } from '@/utils/get-row-range.ts';
import { reorderElements } from '@/utils/reorder-elements.ts';
import styles from './entity-table.module.scss';

interface EntityTableContentProps<T> {
    rowColumnStyles?: CSSProperties;
    table: Table<T>;
    tableId: string;
}

export const EntityTableContent = <T extends { id: string }>(props: EntityTableContentProps<T>) => {
    const { table, rowColumnStyles } = props;
    const { rows } = table.getRowModel();

    const rootRef = useRef(null);
    const viewportRef = useRef(null);

    const [initialize] = useOverlayScrollbars({
        defer: true,
        options: {
            overflow: { x: 'scroll', y: 'scroll' },
            scrollbars: {
                autoHide: 'leave',
                autoHideDelay: 500,
                pointers: ['mouse', 'pen', 'touch'],
                theme: 'app',
                visibility: 'visible',
            },
        },
    });

    // https://github.com/KingSora/OverlayScrollbars/issues/639
    useEffect(() => {
        const { current: root } = rootRef;
        const { current: viewport } = viewportRef;

        if (root && viewport) {
            initialize({
                elements: {
                    viewport,
                },
                target: root,
            });
        }
    }, [initialize]);

    return (
        <div
            ref={rootRef}
            data-overlayscrollbars-initialize=""
        >
            <div ref={viewportRef}>
                {rows.map((virtualRow) => {
                    const row = rows[virtualRow.index];
                    return (
                        <EntityTableRow
                            key={`row-${row.id}`}
                            row={row}
                            rowStyle={{
                                ...rowColumnStyles,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

interface VirtualDraggableEntityTableContentProps<T> extends EntityTableContentProps<T> {
    data: {
        rows: T[];
        setRows: (rows: T[]) => void;
    };
    dndProps?: ReturnType<typeof useDnd>;
}

export const VirtualDraggableEntityTableContent = <T extends { id: string }>(
    props: VirtualDraggableEntityTableContentProps<T>,
) => {
    const { table, data, rowColumnStyles, tableId } = props;
    const { rows } = table.getRowModel();

    const rootRef = useRef(null);
    const viewportRef = useRef(null);

    const [lastSelectedId, setLastSelectedId] = useState<number | null>(null);

    const [initialize] = useOverlayScrollbars({
        defer: true,
        options: {
            overflow: { x: 'scroll', y: 'scroll' },
            scrollbars: {
                autoHide: 'leave',
                autoHideDelay: 500,
                pointers: ['mouse', 'pen', 'touch'],
                theme: 'app',
                visibility: 'visible',
            },
        },
    });

    const virtualizer = useVirtualizer({
        count: rows.length,
        estimateSize: () => 34,
        getScrollElement: () => viewportRef.current,
        measureElement:
            typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
                ? (element) => element?.getBoundingClientRect().height
                : undefined,
        overscan: 20,
    });

    // https://github.com/KingSora/OverlayScrollbars/issues/639
    useEffect(() => {
        const { current: root } = rootRef;
        const { current: viewport } = viewportRef;

        if (root && viewport) {
            initialize({
                elements: {
                    viewport,
                },
                target: root,
            });
        }
    }, [initialize]);

    const [, setActive] = useState<Row<T>[]>([]);

    useDndMonitor({
        onDragCancel: () => {
            setActive([]);
        },
        onDragEnd: (e) => {
            const { over, active } = e;

            console.log('over', over);
            console.log('active :>> ', active);

            if (over) {
                const overIndex = rows.findIndex(({ id }) => id === over?.id);

                const selected = table.getSelectedRowModel().flatRows.map((row) => row.original);

                const reordered = reorderElements(data.rows, {
                    elements: [...selected],
                    newIndex: overIndex,
                });

                data.setRows(reordered);
            }

            setActive([]);
        },
        onDragStart: () => {
            const selected = table.getSelectedRowModel().flatRows;
            setActive(selected);
        },
    });

    return (
        <div
            ref={rootRef}
            data-overlayscrollbars-initialize=""
        >
            <div
                ref={viewportRef}
                style={{
                    height: '500px',
                    overflow: 'auto',
                }}
            >
                <div
                    className={styles.listRows}
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        position: 'relative',
                    }}
                >
                    <SortableContext
                        items={data.rows}
                        strategy={verticalListSortingStrategy}
                    >
                        {virtualizer.getVirtualItems().map((virtualRow) => {
                            const row = rows[virtualRow.index];
                            return (
                                <DraggableEntityTableRow
                                    key={`row-${row.id}`}
                                    handleRowSelection={(e, row) => {
                                        e.stopPropagation();

                                        if (e.shiftKey) {
                                            const { rows, rowsById } = table.getRowModel();

                                            const currentIndex = row.index;

                                            const rowsToToggle = getRowRange(
                                                rows,
                                                currentIndex,
                                                Number(lastSelectedId),
                                            );
                                            const isCellSelected = rowsById[row.id].getIsSelected();
                                            rowsToToggle.forEach((_row) =>
                                                _row.toggleSelected(!isCellSelected),
                                            );
                                        } else if (e.ctrlKey) {
                                            row.toggleSelected();
                                        } else {
                                            table.resetRowSelection();
                                            row.toggleSelected();
                                        }

                                        setLastSelectedId(row.index);
                                    }}
                                    row={row}
                                    rowStyle={{
                                        ...rowColumnStyles,
                                    }}
                                    style={{
                                        height: tableId
                                            ? `var(--var-${tableId}-row-height)`
                                            : '50px',
                                        position: 'absolute',
                                        transform: `translateY(${virtualRow.start}px)`,
                                        width: '100%',
                                    }}
                                />
                            );
                        })}
                    </SortableContext>
                </div>
            </div>
        </div>
    );
};
