import type { MouseEvent, MutableRefObject } from 'react';
import { useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import type { ExpandedState, Row, Table } from '@tanstack/react-table';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import clsx from 'clsx';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import type {
    FlatIndexLocationWithAlign,
    FlatScrollIntoViewLocation,
    GroupedVirtuosoHandle,
    StateCallback,
} from 'react-virtuoso';
import { GroupedVirtuoso } from 'react-virtuoso';
import { ComponentErrorBoundary } from '@/features/shared/error-boundary/component-error-boundary.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { ItemTableProps } from '@/features/ui/item-list/item-table/item-table.tsx';
import { TableGroup } from '@/features/ui/item-list/item-table/table-group.tsx';
import { TableHeader } from '@/features/ui/item-list/item-table/table-header.tsx';
import { TableRow } from '@/features/ui/item-list/item-table/table-row.tsx';
import styles from './item-table.module.scss';

interface GroupedItemTableProps<T> extends Omit<ItemTableProps<T>, 'ItemComponent'> {
    groups: ItemTableGroup[];
    onGroupClick?: (
        e: MouseEvent<HTMLDivElement>,
        items: Row<T | undefined>[],
        group: ItemTableGroup,
        table: Table<T | undefined>,
    ) => void;
}

export type ItemTableGroup = { count: number; name: string };

export const GroupedItemTable = <T extends { _uniqueId: string; id: string }>(
    props: GroupedItemTableProps<T>,
) => {
    const {
        columns,
        columnOrder,
        onChangeColumnOrder,
        context,
        data,
        enableMultiRowSelection,
        enableRowDrag = true,
        enableRowSelection,
        getRowId,
        groups,
        HeaderComponent,
        initialScrollIndex,
        enableHeader = true,
        isScrolling,
        itemCount,
        itemType,
        onEndReached,
        onRangeChanged,
        onRowClick,
        onRowContextMenu,
        onRowDoubleClick,
        onRowDrag,
        onRowDragData,
        onRowDrop,
        onScroll,
        onStartReached,
        rowIdProperty,
        virtuosoRef,
    } = props;

    const tableId = useId();

    const ref = useRef<GroupedVirtuosoHandle | null>(null);
    const rowsRef = useRef(null);

    const [scroller, setScroller] = useState<HTMLElement | Window | null>(null);
    const [initialize, osInstance] = useOverlayScrollbars({
        defer: true,
        options: {
            overflow: { x: 'hidden', y: 'scroll' },
            paddingAbsolute: true,
            scrollbars: {
                autoHide: 'leave',
                autoHideDelay: 500,
                pointers: ['mouse', 'pen', 'touch'],
                theme: 'al-os-scrollbar',
                visibility: 'visible',
            },
        },
    });

    useEffect(() => {
        const { current: root } = rowsRef;

        if (scroller && root) {
            initialize({
                elements: { viewport: scroller as HTMLElement },
                target: root,
            });

            autoScrollForElements({
                element: scroller as HTMLElement,
                getAllowedAxis: () => 'vertical',
                getConfiguration: () => ({ maxScrollSpeed: 'fast' }),
            });
        }

        return () => osInstance()?.destroy();
    }, [scroller, initialize, osInstance]);

    const [expanded, setExpanded] = useState<ExpandedState>(true);

    const tableData = useMemo(() => {
        setExpanded(true);
        return data;
    }, [data]);

    const table = useReactTable({
        columns,
        data: tableData,
        enableMultiRowSelection: enableMultiRowSelection ?? false,
        enableRowSelection: enableRowSelection ?? false,
        getCoreRowModel: getCoreRowModel(),
        getRowId: getRowId ?? ((_, index) => index.toString()),
        getSortedRowModel: getSortedRowModel(),
        onExpandedChange: setExpanded,
        state: {
            columnOrder,
            expanded,
        },
    });

    const headers = table.getFlatHeaders();

    const columnStyles = useMemo(() => {
        const headerSizes = headers.map((header) => header.getSize());

        const sizes: string[] = [];
        const columns = headerSizes.map((size) => {
            if (size > 100000) {
                sizes.push(itemListHelpers.table.columnSizeToStyle(size));
                return itemListHelpers.table.columnSizeToStyle(size);
            }

            sizes.push(itemListHelpers.table.columnSizeToStyle(size));
            return itemListHelpers.table.columnSizeToStyle(size);
        });

        const styles = {
            gridTemplateColumns: columns.join(' '),
        };

        return { sizes, styles };
    }, [headers]);

    const tableContext = useMemo(() => ({ ...context, columnStyles }), [context, columnStyles]);

    useImperativeHandle(virtuosoRef, () => ({
        autoscrollToBottom: () => {
            ref?.current?.autoscrollToBottom();
        },
        getState: (stateCb: StateCallback) => {
            ref?.current?.getState(stateCb);
        },
        getTable: () => table,
        scrollBy: (location: ScrollToOptions) => {
            ref?.current?.scrollBy(location);
        },
        scrollIntoView: (location: FlatScrollIntoViewLocation) => {
            ref?.current?.scrollIntoView(location);
        },
        scrollTo: (location: ScrollToOptions) => {
            ref?.current?.scrollTo(location);
        },
        scrollToIndex: (location: number | FlatIndexLocationWithAlign) => {
            ref?.current?.scrollToIndex(location);
        },
    }));

    return (
        <div
            className={clsx(styles.container, {
                [styles.noHeader]: !enableHeader,
            })}
        >
            {enableHeader && (
                <div className={styles.header} style={columnStyles.styles}>
                    {headers.map((header) => (
                        <TableHeader
                            key={`header-${header.id}`}
                            columnOrder={columnOrder}
                            columnStyles={columnStyles.styles}
                            header={header}
                            setColumnOrder={onChangeColumnOrder}
                            tableId={tableId}
                        />
                    ))}
                </div>
            )}
            <ComponentErrorBoundary>
                <div ref={rowsRef} className={styles.rows} data-overlayscrollbars-initialize="">
                    <GroupedVirtuoso
                        ref={ref as MutableRefObject<GroupedVirtuosoHandle>}
                        components={{
                            Header: HeaderComponent
                                ? (props) => <HeaderComponent {...props} />
                                : undefined,
                        }}
                        context={tableContext}
                        endReached={onEndReached}
                        groupContent={(index) => (
                            <TableGroup groups={groups} index={index} table={table} />
                        )}
                        groupCounts={groups.map((group) => group.count)}
                        increaseViewportBy={100}
                        initialTopMostItemIndex={initialScrollIndex || 0}
                        isScrolling={isScrolling}
                        itemContent={(index) => {
                            if (index < itemCount) {
                                return (
                                    <TableRow
                                        context={tableContext}
                                        enableExpanded={true}
                                        enableRowDrag={enableRowDrag}
                                        index={index}
                                        itemType={itemType}
                                        rowId={
                                            getRowId && rowIdProperty
                                                ? (data[index]?.[
                                                      rowIdProperty as keyof T
                                                  ] as string)
                                                : index.toString()
                                        }
                                        table={table}
                                        tableId={tableId}
                                        onRowClick={onRowClick}
                                        onRowContextMenu={onRowContextMenu}
                                        onRowDoubleClick={onRowDoubleClick}
                                        onRowDrag={onRowDrag}
                                        onRowDragData={onRowDragData}
                                        onRowDrop={onRowDrop}
                                    />
                                );
                            }

                            return null;
                        }}
                        logLevel={undefined}
                        rangeChanged={onRangeChanged}
                        scrollerRef={setScroller}
                        startReached={onStartReached}
                        onScroll={onScroll}
                    />
                </div>
            </ComponentErrorBoundary>
        </div>
    );
};
