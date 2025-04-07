import type {
    ItemListColumn,
    ItemListColumnDefinitions,
    ItemListColumnOrder,
} from '/@/features/shared/components/item-list/utils/helpers';
import type { DragData } from '/@/utils/drag-drop';
import type { ServerItemType } from '@repo/shared-types/app-types';
import type {
    CSSProperties,
    ElementType,
    MutableRefObject,
    RefObject,
    SyntheticEvent,

} from 'react';
import type {
    FlatIndexLocationWithAlign,
    FlatScrollIntoViewLocation,
    ItemProps,
    ListProps,
    ScrollSeekPlaceholderProps,
    StateCallback,
    VirtuosoHandle,
} from 'react-virtuoso';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import clsx, { } from 'clsx';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import React, {
    forwardRef,
    useEffect,
    useId,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Virtuoso } from 'react-virtuoso';
import styles from './item-list-table.module.css';
import { ComponentErrorBoundary } from '/@/components/error-boundary/component-error-boundary';
import {
    ExpandedItemListContent,
} from '/@/features/shared/components/item-list/expanded-item-list-content/expanded-item-list-content';
import { itemListHelpers, useItemListInternalState } from '/@/features/shared/components/item-list/utils/helpers';
import { ItemTableHeader } from '/@/features/shared/components/item-table-header/item-table-header';
import { ItemTableRow } from '/@/features/shared/components/item-table-row/item-table-row';
import { DragTarget } from '/@/utils/drag-drop';

const BaseListComponent = forwardRef<
    HTMLDivElement,
    ListProps & { context: any }
>((props, ref) => {
    const { children, context, style, ...rest } = props;

    const cssVars = {
        '--grid-template-columns': context.columnStyles.gridTemplateColumns,
    } as CSSProperties;

    return (
        <div
            ref={ref as unknown as RefObject<HTMLTableSectionElement>}
            className={styles.baseListComponent}
            style={{
                ...style,
                ...cssVars,
            }}
            {...rest}
        >
            {children}
        </div>
    );
});

const BaseItemComponent = forwardRef<
    HTMLDivElement,
    ItemProps<any> & { context: any }
>((props, ref) => {
    const { children, context, 'data-index': index, style, ...rest } = props;

    const id = (props.children as any).props.data;

    const isExpanded = context.reducers.getExpandedById(id);

    return (
        <>
            <div
                ref={ref}
                className={clsx(styles.baseItemComponent, 'base-item-component')}
                data-index={index}
                data-item-group-index={rest['data-item-group-index']}
                data-item-id={rest.item}
                data-known-size={rest['data-known-size']}
            >
                {children}
            </div>
            {isExpanded && (
                <ExpandedItemListContent id={id} />
            )}
        </>
    );
});

function ScrollSeekPlaceholderComponent(props: ScrollSeekPlaceholderProps & { context: Record<string, any> }) {
    const { context, index } = props;

    return (
        <div className={clsx(styles.scrollSeekPlaceholder, 'scroll-seek-placeholder')}>
            <ItemTableRow
                columns={context.columns}
                data={undefined}
                id={undefined}
                index={index}
                itemType={context.itemType}
                type="default-skeleton"
            />
        </div>
    );
}

export type ItemListTableComponent = Parameters<typeof Virtuoso>['0']['itemContent'];

export interface ItemListTableProps<T, C> {
    columnOrder: ItemListColumnOrder;
    context: C;
    data: (T | undefined)[];
    disableAutoScroll?: boolean;
    enableHeader?: boolean;
    enableStickyHeader?: boolean;
    getItemId?: (index: number) => string;
    HeaderComponent?: ElementType;
    initialScrollIndex?: number;
    isScrolling?: (isScrolling: boolean) => void;
    ItemComponent: ItemListTableComponent;
    itemCount: number;
    itemSelectionType?: 'single' | 'multiple';
    itemType: ServerItemType;
    onChangeColumnOrder?: (columnOrder: ItemListColumn[]) => void;
    onEndReached?: (index: number) => void;
    onRangeChanged?: (args: { endIndex: number; startIndex: number }) => void;
    onScroll?: (event: SyntheticEvent) => void;
    onStartReached?: (index: number) => void;
    virtuosoRef?: MutableRefObject<ItemListTableHandle | undefined>;
}

export interface ItemListTableHandle extends VirtuosoHandle {
    deselectAll: () => void;
    getSelection: () => {
        ids: string[];
        items: unknown[];
    };
    selectAll: () => void;
}

export function ItemListTable<TDataType, TItemType>(props: ItemListTableProps<TDataType, TItemType>) {
    const {
        columnOrder,
        context,
        data,
        disableAutoScroll,
        enableHeader = true,
        enableStickyHeader,
        getItemId,
        HeaderComponent,
        initialScrollIndex,
        isScrolling,
        ItemComponent,
        itemCount,
        itemSelectionType,
        itemType,
        onChangeColumnOrder,
        onEndReached,
        onRangeChanged,
        onScroll,
        onStartReached,
        virtuosoRef,
    } = props;

    const tableId = useId();

    const ref = useRef<VirtuosoHandle | null>(null);

    const rowsRef = useRef(null);

    const [scroller, setScroller] = useState<HTMLElement | Window | null>(null);
    const [initialize, osInstance] = useOverlayScrollbars({
        defer: true,
        options: {
            overflow: { x: 'scroll', y: 'scroll' },
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

    const columns = useMemo(() => itemListHelpers.table.getColumns(columnOrder), [columnOrder]);

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
                        const data = args.source.data as unknown as DragData<unknown>;
                        if (data.type === DragTarget.TABLE_COLUMN)
                            return false;
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

    const {
        _onMultiSelectionClick,
        _onSingleSelectionClick,
        itemExpanded,
        itemSelection,
        reducers,
    } = useItemListInternalState<TDataType, TItemType>({
        data,
        getItemId,
        ref: ref?.current as VirtuosoHandle | undefined,
    });

    const columnStyles = useMemo(() => {
        const headerSizes = columns.map(column => column.size);

        const sizes: string[] = [];
        const styles = headerSizes.map((size) => {
            if (size > 100000) {
                sizes.push(itemListHelpers.table.columnSizeToStyle(size));
                return itemListHelpers.table.columnSizeToStyle(size);
            }

            sizes.push(itemListHelpers.table.columnSizeToStyle(size));
            return itemListHelpers.table.columnSizeToStyle(size);
        });

        return {
            gridTemplateColumns: styles.join(' '),
        };
    }, [columns]);

    useImperativeHandle(virtuosoRef, () => ({
        autoscrollToBottom: () => {
            ref?.current?.autoscrollToBottom();
        },
        deselectAll: () => {
            reducers.setSelection({});
        },
        getSelection: () => {
            const items = data.filter((_, index) => {
                const id = getItemId ? getItemId(index) : undefined;
                return id ? itemSelection[id] : false;
            });

            return {
                ids: Object.keys(itemSelection),
                items,
            };
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

            for (const [index] of data.entries()) {
                const id = getItemId ? getItemId(index) : undefined;
                if (id) {
                    selection[id] = true;
                }
            }

            reducers.setSelection(selection);
        },
    }));

    const tableContext = useMemo(() => ({
        ...context,
        columnOrder,
        columns,
        columnStyles,
        itemExpanded,
        itemSelection,
        itemSelectionType,
        itemType,
        onItemSelection: itemSelectionType === 'multiple'
            ? _onMultiSelectionClick
            : itemSelectionType === 'single' ? _onSingleSelectionClick : undefined,
        reducers,
        tableId,
    }), [
        context,
        columnOrder,
        columns,
        columnStyles,
        itemExpanded,
        itemSelection,
        itemSelectionType,
        itemType,
        _onMultiSelectionClick,
        _onSingleSelectionClick,
        reducers,
        tableId,
    ]);

    return (
        <div className={clsx(styles.container)}>
            {enableHeader && (
                <TableHeader
                    columnOrder={columnOrder}
                    columnStyles={columnStyles}
                    columns={columns}
                    tableId={tableId}
                    onChangeColumnOrder={onChangeColumnOrder}
                />
            )}
            <ComponentErrorBoundary>
                <div
                    ref={rowsRef}
                    className={styles.rows}
                    data-overlayscrollbars-initialize=""
                    draggable="false"
                >
                    <Virtuoso
                        ref={ref}
                        components={{
                            Header: HeaderComponent
                                ? props => <HeaderComponent {...props} />
                                : undefined,
                            Item: BaseItemComponent,
                            List: BaseListComponent,
                            ScrollSeekPlaceholder: ScrollSeekPlaceholderComponent,
                        }}
                        context={tableContext}
                        data={data}
                        endReached={onEndReached}
                        increaseViewportBy={300}
                        initialTopMostItemIndex={initialScrollIndex || 0}
                        isScrolling={isScrolling}
                        itemContent={ItemComponent}
                        overscan={0}
                        rangeChanged={onRangeChanged}
                        scrollSeekConfiguration={{
                            enter: velocity => Math.abs(velocity) > 2000,
                            exit: (velocity) => {
                                const shouldExit = Math.abs(velocity) < 100;
                                return shouldExit;
                            },
                        }}
                        scrollerRef={setScroller}
                        startReached={onStartReached}
                        style={{ overflow: 'hidden' }}
                        topItemCount={enableStickyHeader ? 1 : 0}
                        totalCount={itemCount}
                        onScroll={onScroll}
                    />
                </div>
            </ComponentErrorBoundary>
        </div>
    );
}

export function TableHeader(props: {
    columnOrder: ItemListColumn[];
    columns: ItemListColumnDefinitions;
    columnStyles?: Record<string, any>;
    onChangeColumnOrder?: (columnOrder: ItemListColumn[]) => void;
    tableId: string;
}) {
    const { columnOrder, columns, columnStyles, onChangeColumnOrder, tableId } = props;

    return (
        <div className={styles.header} style={{ ...columnStyles }}>
            {columns.map(column => (
                <ItemTableHeader
                    key={`header-${column.id}`}
                    column={column}
                    columnOrder={columnOrder}
                    columnStyles={columnStyles?.styles || {}}
                    setColumnOrder={onChangeColumnOrder}
                    tableId={tableId}
                />
            ))}
        </div>
    );
}
