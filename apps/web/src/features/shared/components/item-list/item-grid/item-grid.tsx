/* eslint-disable react/no-clone-element */
/* eslint-disable react/no-children-map */
import type { ItemListPaginationState } from '/@/features/shared/components/item-list/types';
import type { AuthServer, ServerItemType } from '@repo/shared-types/app-types';
import type { CSSProperties, ReactNode, RefObject, SyntheticEvent } from 'react';
import type { GridIndexLocation, GridStateSnapshot, VirtuosoGridHandle } from 'react-virtuoso';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import {
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
    Suspense,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import styles from './item-grid.module.css';
import { ItemCard, type ItemCardProps } from '/@/features/shared/components/item-card/item-card';
import { useItemListInternalState } from '/@/features/shared/components/item-list/helpers';

const BaseListComponent = forwardRef<
    HTMLDivElement,
    { children?: ReactNode; className?: string; style?: CSSProperties }
>((props, ref) => {
    const { children, className, style, ...rest } = props;

    return (
        <div
            ref={ref}
            className={clsx(styles.gridListComponent, className)}
            style={{ ...style }}
            {...rest}
        >
            {children}
        </div>
    );
});

BaseListComponent.displayName = 'BaseListComponent';

const BaseItemComponent = forwardRef<
    HTMLDivElement,
    {
        'children'?: ReactNode;
        'className'?: string;
        'context'?: unknown;
        'data-index': number;
        'enableExpanded'?: boolean;
        'style'?: CSSProperties;
        'virtuosoRef'?: RefObject<VirtuosoGridHandle>;
    }
>((props, ref) => {
    const { children, 'data-index': index, enableExpanded, virtuosoRef } = props;

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'style') {
                    const expandedIndex = getComputedStyle(document.documentElement)
                        .getPropertyValue('--opened-item-index')
                        .trim();
                    setIsExpanded(expandedIndex === index.toString());
                }
            });
        });

        observer.observe(document.documentElement, {
            attributeFilter: ['style'],
            attributes: true,
        });

        return () => observer.disconnect();
    }, [index]);

    const handleClick = () => {
        if (!enableExpanded) {
            return;
        }

        if (isExpanded) {
            document.documentElement.style.removeProperty('--opened-item-index');
        }
        else {
            document.documentElement.style.setProperty('--opened-item-index', index.toString());

            virtuosoRef?.current?.scrollToIndex({
                align: 'start',
                behavior: 'smooth',
                index,
            });
        }
    };

    return (
        <>
            <div ref={ref} className={clsx(styles.gridItemComponent)} onClick={handleClick}>
                {children}
            </div>
            <AnimatePresence mode="wait">
                {isExpanded && (
                    <motion.div
                        animate={{
                            height: '35svh',
                            maxHeight: '400px',
                            opacity: 1,
                            overflow: 'hidden',
                            y: 0,
                        }}
                        className={styles.fullWidthContent}
                        exit={{ height: '0px', opacity: 0, overflow: 'hidden' }}
                        initial={{ height: '0px', opacity: 0, overflow: 'hidden' }}
                        transition={{
                            height: { duration: 0 },
                            maxHeight: { duration: 0 },
                            x: { duration: 0.5 },
                        }}
                    >
                        <Suspense fallback={null}>
                            {Children.map(children, (child) => {
                                if (isValidElement(child)) {
                                    return cloneElement<any>(child, {
                                        isExpanded: true,
                                    });
                                }
                                return child;
                            })}
                        </Suspense>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
});

BaseItemComponent.displayName = 'BaseItemComponent';

function ScrollSeekPlaceholderComponent({
    context,
    index,
}: any) {
    const {
        displayType,
        lines,
    } = context as { displayType: ItemCardProps<any>['type']; lines: ItemCardProps<any>['lines'] };

    const type = displayType === 'default' ? 'default-skeleton' : displayType;

    return (
        <div className={styles.scrollSeekPlaceholder}>
            <ItemCard
                data={undefined}
                id={undefined}
                index={index}
                lines={lines}
                type={type as any}
            />
        </div>
    );
}

export interface GridItemProps<
    T,
    C,
> {
    context: C;
    data: T | undefined;
    index: number;
    isExpanded?: boolean;
    itemType: ServerItemType;
}

export type ItemGridComponent = Parameters<typeof VirtuosoGrid>['0']['itemContent'];

interface ItemGridProps<
    T,
    C,
> {
    context?: C;
    data: (T | undefined)[];
    displayType: ItemCardProps<T>['type'];
    getItemId?: (index: number) => string;
    initialScrollIndex?: number;
    isScrolling?: (isScrolling: boolean) => void;
    ItemComponent: ItemGridComponent;
    itemCount: number;
    itemSelectionType?: 'single' | 'multiple';
    itemType: ServerItemType;
    onEndReached?: (index: number) => void;
    onRangeChanged?: (args: { endIndex: number; startIndex: number }) => void;
    onScroll?: (event: SyntheticEvent) => void;
    onStartReached?: (index: number) => void;
    onStateChanged?: (state: GridStateSnapshot) => void;
    restoreState?: GridStateSnapshot | null | undefined;
    virtuosoRef?: RefObject<VirtuosoGridHandle | undefined>;
}

export function ItemGrid<
    T,
    C,
>({
    context,
    data,
    displayType,
    initialScrollIndex,
    isScrolling,
    ItemComponent,
    itemCount = 0,
    itemSelectionType,
    itemType,
    onEndReached,
    onRangeChanged,
    onScroll,
    onStartReached,
    onStateChanged,
    restoreState,
    virtuosoRef,
}: ItemGridProps<T, C>) {
    const rootRef = useRef(null);

    const [scroller, setScroller] = useState<HTMLElement | null>(null);
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
        const { current: root } = rootRef;

        if (scroller && root) {
            initialize({
                elements: { viewport: scroller },
                target: root,
            });
        }

        return () => osInstance()?.destroy();
    }, [scroller, initialize, osInstance]);

    const ref = useRef<VirtuosoGridHandle | null>(null);

    const {
        _onMultiSelectionClick,
        _onSingleSelectionClick,
        itemSelection,
        reducers,
    } = useItemListInternalState({ data });

    useImperativeHandle(virtuosoRef, () => ({
        scrollBy: (location: ScrollToOptions) => {
            ref?.current?.scrollBy(location);
        },
        scrollTo: (location: ScrollToOptions) => {
            ref?.current?.scrollTo(location);
        },
        scrollToIndex: (location: GridIndexLocation) => {
            ref?.current?.scrollToIndex(location);
        },
        selectAll: () => {
            const selection: Record<string, boolean> = {};

            for (const item of data) {
                const id = item as string;

                if (id) {
                    selection[id] = true;
                }
            }

            reducers.setSelection(selection);
        },
        selectNone: () => {
            reducers.clearSelection();
        },
    }));

    const gridContext = useMemo(() => ({
        ...context,
        displayType,
        itemSelection,
        itemSelectionType,
        itemType,
        onItemSelection: itemSelectionType === 'multiple'
            ? _onMultiSelectionClick
            : itemSelectionType === 'single' ? _onSingleSelectionClick : undefined,
    }), [
        context,
        displayType,
        itemSelection,
        itemSelectionType,
        itemType,
        _onMultiSelectionClick,
        _onSingleSelectionClick,
    ]);

    return (
        <div
            ref={rootRef}
            className={styles.itemGridContainer}
            data-overlayscrollbars-initialize=""
        >
            <VirtuosoGrid
                ref={ref}
                components={{
                    Item: BaseItemComponent,
                    List: BaseListComponent,
                    ScrollSeekPlaceholder: ScrollSeekPlaceholderComponent,
                }}
                context={gridContext}
                data={data}
                endReached={onEndReached}
                increaseViewportBy={300}
                initialTopMostItemIndex={initialScrollIndex || 0}
                isScrolling={isScrolling}
                itemContent={ItemComponent}
                overscan={0}
                rangeChanged={onRangeChanged}
                restoreStateFrom={restoreState}
                scrollSeekConfiguration={{
                    enter: velocity => Math.abs(velocity) > 2000,
                    exit: (velocity) => {
                        const shouldExit = Math.abs(velocity) < 500;
                        return shouldExit;
                    },
                }}
                scrollerRef={setScroller}
                startReached={onStartReached}
                stateChanged={onStateChanged}
                style={{ overflow: 'hidden' }}
                totalCount={itemCount}
                onScroll={onScroll}
            />
        </div>
    );
}

export interface ServerItemGridProps<TParams> {
    itemSelectionType?: 'single' | 'multiple';
    pagination: ItemListPaginationState;
    params: TParams;
    server: AuthServer;
}
