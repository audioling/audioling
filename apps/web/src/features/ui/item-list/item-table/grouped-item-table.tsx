import type { MouseEvent, MutableRefObject } from 'react';
import { useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import type { ExpandedState, Row, Table } from '@tanstack/react-table';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import clsx from 'clsx';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import type { GroupedVirtuosoHandle } from 'react-virtuoso';
import { GroupedVirtuoso } from 'react-virtuoso';
import { ComponentErrorBoundary } from '@/features/shared/error-boundary/component-error-boundary.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { ItemTableProps } from '@/features/ui/item-list/item-table/item-table.tsx';
import { TableGroup } from '@/features/ui/item-list/item-table/table-group.tsx';
import { TableHeader } from '@/features/ui/item-list/item-table/table-header.tsx';
import { TableRow } from '@/features/ui/item-list/item-table/table-row.tsx';
import styles from './item-table.module.scss';

interface GroupedItemTableProps<T, C extends { baseUrl: string; libraryId: string }>
    extends ItemTableProps<T, C> {
    groups: ItemTableGroup[];
    itemTableRef?: MutableRefObject<GroupedVirtuosoHandle | undefined>;
    onGroupClick?: (
        e: MouseEvent<HTMLDivElement>,
        items: Row<T | undefined>[],
        group: ItemTableGroup,
        table: Table<T | undefined>,
    ) => void;
}

export type ItemTableGroup = { count: number; name: string };

export type GroupedItemTableHandle<T> = GroupedVirtuosoHandle & {
    getTable: () => Table<T | undefined>;
};

export const GroupedItemTable = <
    T extends { _uniqueId: string; id: string },
    C extends { baseUrl: string; libraryId: string },
>(
    props: GroupedItemTableProps<T, C>,
) => {
    const {
        columns,
        columnOrder,
        onChangeColumnOrder,
        context,
        data,
        enableMultiRowSelection,
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
        onRowDoubleClick,
        onRowContextMenu,
        onRowDrop,
        onScroll,
        onStartReached,
        rowIdProperty,
        itemTableRef,
    } = props;

    const tableId = useId();

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

        return Array.from({ length: itemCount }, (_, index) => data.get(index)).filter(
            (item): item is T => item !== undefined,
        );
    }, [data, itemCount]);

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

    useImperativeHandle<
        GroupedVirtuosoHandle | undefined,
        (GroupedVirtuosoHandle & { getTable: () => Table<T | undefined> }) | undefined
    >(itemTableRef, () => {
        if (itemTableRef && 'current' in itemTableRef && itemTableRef.current) {
            return {
                ...itemTableRef.current,
                getTable: () => table,
            };
        }

        return undefined;
    });

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
                        ref={itemTableRef as MutableRefObject<GroupedVirtuosoHandle>}
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
                                        index={index}
                                        itemType={itemType}
                                        rowId={
                                            getRowId && rowIdProperty
                                                ? (data.get(index)?.[
                                                      rowIdProperty as keyof T
                                                  ] as string)
                                                : index.toString()
                                        }
                                        table={table}
                                        tableId={tableId}
                                        onRowClick={onRowClick}
                                        onRowContextMenu={onRowContextMenu}
                                        onRowDoubleClick={onRowDoubleClick}
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
