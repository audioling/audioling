import type { MouseEvent, MutableRefObject } from 'react';
import {
    useCallback,
    useEffect,
    useId,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
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
import { useItemListInternalState } from '@/hooks/use-list.ts';
import { DragTarget } from '@/utils/drag-drop.ts';
import type { DragData } from '@/utils/drag-drop.ts';
import styles from './item-table.module.scss';

interface GroupedItemTableProps<TDataType, TItemType> extends ItemTableProps<TDataType, TItemType> {
    groups: ItemTableGroup[];
    onGroupClick?: (e: MouseEvent<HTMLDivElement>, group: ItemTableGroup) => void;
}

export type ItemTableGroup = { count: number; name: string };

export const GroupedItemTable = <TDataType, TItemType>(
    props: GroupedItemTableProps<TDataType, TItemType>,
) => {
    const {
        columns,
        columnOrder,
        onChangeColumnOrder,
        context,
        data,
        disableAutoScroll,
        enableMultiRowSelection,
        enableSingleRowSelection,
        enableDragItem,
        getItemId,
        groups,
        HeaderComponent,
        initialScrollIndex,
        enableHeader,
        isScrolling,
        ItemComponent,
        itemCount,
        itemType,
        onEndReached,
        onRangeChanged,
        onItemClick,
        onItemContextMenu,
        onItemDoubleClick,
        onItemDrag,
        onItemDragData,
        onItemDrop,
        onScroll,
        onStartReached,
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

            if (!disableAutoScroll) {
                autoScrollForElements({
                    canScroll: (args) => {
                        const data = args.source.data as DragData<unknown>;
                        if (data.type === DragTarget.TABLE_COLUMN) return false;
                        return true;
                    },
                    element: scroller as HTMLElement,
                    getAllowedAxis: () => 'vertical',
                    getConfiguration: () => ({ maxScrollSpeed: 'fast' }),
                });
            }
        }

        return () => osInstance()?.destroy();
    }, [scroller, initialize, osInstance, disableAutoScroll]);

    const columnStyles = useMemo(() => {
        const headerSizes = columns.map((column) => column.size);

        const sizes: string[] = [];
        const columnsStyles = headerSizes.map((size) => {
            if (size > 100000) {
                sizes.push(itemListHelpers.table.columnSizeToStyle(size));
                return itemListHelpers.table.columnSizeToStyle(size);
            }

            sizes.push(itemListHelpers.table.columnSizeToStyle(size));
            return itemListHelpers.table.columnSizeToStyle(size);
        });

        const styles = {
            gridTemplateColumns: columnsStyles.join(' '),
        };

        return { sizes, styles };
    }, [columns]);

    useImperativeHandle(virtuosoRef, () => ({
        autoscrollToBottom: () => {
            ref?.current?.autoscrollToBottom();
        },
        deselectAll: () => {
            reducers.setSelection({});
        },
        getState: (stateCb: StateCallback) => {
            ref?.current?.getState(stateCb);
        },
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
        selectAll: () => {
            const selection: Record<string, boolean> = {};

            for (const [index, item] of data.entries()) {
                const id = getItemId ? getItemId(index, item as TItemType) : undefined;
                if (id) {
                    selection[id] = true;
                }
            }

            reducers.setSelection(selection);
        },
    }));

    const { _onMultiSelectionClick, _onSingleSelectionClick, itemSelection, reducers } =
        useItemListInternalState();

    const handleItemClick = useCallback(
        (args: { id: string; index: number; item: TItemType }, e: MouseEvent<HTMLDivElement>) => {
            const { id, index, item } = args;

            e.preventDefault();
            e.stopPropagation();

            if (enableMultiRowSelection) {
                _onMultiSelectionClick(
                    id,
                    data.map((d) => getItemId?.(index, d as TItemType) || ''),
                    index,
                    e,
                );
            } else if (enableSingleRowSelection) {
                _onSingleSelectionClick(id, e);
            }

            onItemClick?.({ data, id, index, item, reducers }, e);
        },
        [
            _onMultiSelectionClick,
            _onSingleSelectionClick,
            data,
            enableMultiRowSelection,
            enableSingleRowSelection,
            getItemId,
            onItemClick,
            reducers,
        ],
    );

    const handleItemDoubleClick = useCallback(
        (args: { id: string; index: number; item: TItemType }, e: MouseEvent<HTMLDivElement>) => {
            const { id, index, item } = args;

            onItemDoubleClick?.({ data, id, index, item, reducers }, e);
        },
        [data, onItemDoubleClick, reducers],
    );

    const handleItemContextMenu = useCallback(
        (
            args: { id: string; index: number; item: TItemType; selectedIds: string[] },
            e: MouseEvent<HTMLDivElement | HTMLButtonElement>,
        ) => {
            const { id, index, item, selectedIds } = args;

            onItemContextMenu?.({ data, id, index, item, reducers, selectedIds }, e);
        },
        [data, onItemContextMenu, reducers],
    );

    const groupCounts = useMemo(() => groups.map((group) => group.count), [groups]);

    return (
        <div
            className={clsx(styles.container, {
                [styles.noHeader]: !enableHeader,
            })}
        >
            {enableHeader && (
                <div className={styles.header} style={columnStyles.styles}>
                    {columns.map((column) => (
                        <TableHeader
                            key={`header-${column.id}`}
                            column={column}
                            columnOrder={columnOrder}
                            columnStyles={columnStyles.styles}
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
                        endReached={onEndReached}
                        groupContent={(index) => <TableGroup groups={groups} index={index} />}
                        groupCounts={groupCounts}
                        increaseViewportBy={100}
                        initialTopMostItemIndex={initialScrollIndex || 0}
                        isScrolling={isScrolling}
                        itemContent={(i) => {
                            if (i < itemCount) {
                                const itemId = getItemId?.(i, data[i] as TItemType) || '';

                                return (
                                    <ItemComponent
                                        columnOrder={columnOrder}
                                        columnStyles={columnStyles}
                                        columns={columns}
                                        data={data[i] as TDataType}
                                        enableDragItem={enableDragItem}
                                        enableExpanded={false}
                                        enableSelection={Boolean(
                                            enableMultiRowSelection || enableSingleRowSelection,
                                        )}
                                        index={i}
                                        isSelected={Boolean(
                                            itemSelection[itemId as keyof typeof itemSelection],
                                        )}
                                        itemType={itemType}
                                        libraryId={context.libraryId}
                                        listKey={context.listKey}
                                        listReducers={reducers}
                                        tableId={tableId}
                                        onChangeColumnOrder={onChangeColumnOrder}
                                        onItemClick={handleItemClick}
                                        onItemContextMenu={handleItemContextMenu}
                                        onItemDoubleClick={handleItemDoubleClick}
                                        onItemDrag={onItemDrag}
                                        onItemDragData={onItemDragData}
                                        onItemDrop={onItemDrop}
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
