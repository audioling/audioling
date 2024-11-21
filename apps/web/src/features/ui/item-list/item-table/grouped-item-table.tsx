import type { MouseEvent } from 'react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import clsx from 'clsx';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { GroupedVirtuoso } from 'react-virtuoso';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { ItemTableProps } from '@/features/ui/item-list/item-table/item-table.tsx';
import { TableHeader } from '@/features/ui/item-list/item-table/table-header.tsx';
import { TableRow } from '@/features/ui/item-list/item-table/table-row.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './item-table.module.scss';

interface GroupedItemTableProps<T, C extends { baseUrl: string; libraryId: string }>
    extends ItemTableProps<T, C> {
    groups: { count: number; name: string }[];
    onGroupClick?: (e: MouseEvent<HTMLDivElement>, group: { count: number; name: string }) => void;
}

export function GroupedItemTable<
    T extends { _uniqueId: string; id: string },
    C extends { baseUrl: string; libraryId: string },
>(props: GroupedItemTableProps<T, C>) {
    const {
        columns,
        columnOrder,
        onChangeColumnOrder,
        context,
        data,
        enableMultiRowSelection,
        enableRowSelection,
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

    const tableData = useMemo(() => {
        return Array.from({ length: itemCount }, (_, index) => data.get(index));
    }, [data, itemCount]);

    const table = useReactTable({
        columns,
        data: tableData,
        enableMultiRowSelection: enableMultiRowSelection ?? false,
        enableRowSelection: enableRowSelection ?? false,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            columnOrder,
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

    return (
        <>
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
                <div ref={rowsRef} className={styles.rows} data-overlayscrollbars-initialize="">
                    <GroupedVirtuoso
                        components={{
                            Header: HeaderComponent
                                ? (props) => <HeaderComponent {...props} />
                                : undefined,
                        }}
                        context={tableContext}
                        endReached={onEndReached}
                        groupContent={(index) => (
                            <div
                                style={{
                                    background: 'rgba(0, 0, 0, 1)',
                                    padding: '0.5rem 0.5rem',
                                    width: '100%',
                                }}
                            >
                                <Group justify="between">
                                    <Text>{groups[index].name}</Text>
                                    <IconButton
                                        icon="ellipsisHorizontal"
                                        size="sm"
                                        variant="transparent"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log(groups[index]);
                                        }}
                                    />
                                </Group>
                            </div>
                        )}
                        groupCounts={groups.map((group) => group.count)}
                        increaseViewportBy={100}
                        initialTopMostItemIndex={initialScrollIndex || 0}
                        isScrolling={isScrolling}
                        itemContent={(index) => (
                            <TableRow
                                context={tableContext}
                                index={index}
                                itemType={itemType}
                                table={table}
                                tableId={tableId}
                                onRowClick={onRowClick}
                                onRowContextMenu={onRowContextMenu}
                                onRowDoubleClick={onRowDoubleClick}
                                onRowDrop={onRowDrop}
                            />
                        )}
                        rangeChanged={onRangeChanged}
                        scrollerRef={setScroller}
                        startReached={onStartReached}
                        style={{ overflow: 'hidden' }}
                        onScroll={onScroll}
                    />
                </div>
            </div>
        </>
    );
}
