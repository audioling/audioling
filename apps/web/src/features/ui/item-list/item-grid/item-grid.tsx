import type { CSSProperties, ReactNode, SyntheticEvent } from 'react';
import React, {
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
    Suspense,
    useEffect,
    useRef,
    useState,
} from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { VirtuosoGrid } from 'react-virtuoso';
import styles from './item-grid.module.scss';

const GridListComponent = forwardRef<
    HTMLDivElement,
    { children?: ReactNode; className?: string; style?: CSSProperties }
>((props, ref) => {
    const { style, children, className, ...rest } = props;

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

GridListComponent.displayName = 'GridListComponent';

const GridItemComponent = forwardRef<
    HTMLDivElement,
    {
        children?: ReactNode;
        className?: string;
        context?: Record<string, unknown>;
        'data-index': number;
        style?: CSSProperties;
    }
>((props, ref) => {
    const { children, 'data-index': index } = props;

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
        if (isExpanded) {
            document.documentElement.style.removeProperty('--opened-item-index');
        } else {
            document.documentElement.style.setProperty('--opened-item-index', index.toString());
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
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

GridItemComponent.displayName = 'GridItemComponent';

export interface InfiniteGridItemProps<T, C extends { baseUrl: string; libraryId: string }> {
    context: C;
    data: T | undefined;
    index: number;
    isExpanded?: boolean;
}

interface InfiniteItemGridProps<T, C extends { baseUrl: string; libraryId: string }> {
    GridComponent: React.ComponentType<InfiniteGridItemProps<T, C>>;
    context: C;
    data: (T | undefined)[];
    initialScrollIndex?: number;
    isScrolling?: (isScrolling: boolean) => void;
    itemCount: number;
    onEndReached?: (index: number) => void;
    onRangeChanged?: (args: { endIndex: number; startIndex: number }) => void;
    onScroll?: (event: SyntheticEvent) => void;
    onStartReached?: (index: number) => void;
}

export function InfiniteItemGrid<T, C extends { baseUrl: string; libraryId: string }>(
    props: InfiniteItemGridProps<T, C>,
) {
    const {
        context,
        data,
        GridComponent,
        itemCount = 0,
        initialScrollIndex,
        isScrolling,
        onEndReached,
        onRangeChanged,
        onScroll,
        onStartReached,
    } = props;
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

    return (
        <div
            ref={rootRef}
            className={styles.itemGridContainer}
            data-overlayscrollbars-initialize=""
        >
            <VirtuosoGrid
                components={{
                    Item: GridItemComponent,
                    List: GridListComponent,
                }}
                data={data}
                endReached={onEndReached}
                increaseViewportBy={600}
                initialTopMostItemIndex={initialScrollIndex || 0}
                isScrolling={isScrolling}
                itemContent={(index, data) => (
                    <GridComponent context={context} data={data} index={index} />
                )}
                rangeChanged={onRangeChanged}
                scrollerRef={setScroller}
                startReached={onStartReached}
                style={{ overflow: 'hidden' }}
                totalCount={itemCount}
                onScroll={onScroll}
            />
        </div>
    );
}
