import type { Ref } from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { clsx } from 'clsx';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { useMergedRef } from '@/hooks/use-merged-ref.ts';
import styles from './scroll-area.module.scss';

interface ScrollAreaProps extends React.ComponentPropsWithoutRef<'div'> {
    allowDragScroll?: boolean;
    children: React.ReactNode;
    debugScrollPosition?: boolean;
    scrollHideDelay?: number;
}

export const ScrollArea = forwardRef((props: ScrollAreaProps, ref: Ref<HTMLDivElement>) => {
    const { allowDragScroll, children, className, scrollHideDelay, ...htmlProps } = props;

    const containerRef = useRef(null);
    const [scroller, setScroller] = useState<HTMLElement | Window | null>(null);

    const [initialize, osInstance] = useOverlayScrollbars({
        defer: false,
        options: {
            overflow: { x: 'hidden', y: 'scroll' },
            paddingAbsolute: true,
            scrollbars: {
                autoHide: 'leave',
                autoHideDelay: scrollHideDelay || 500,
                pointers: ['mouse', 'pen', 'touch'],
                theme: 'al-os-scrollbar',
                visibility: 'visible',
            },
        },
    });

    useEffect(() => {
        const { current: root } = containerRef;

        if (scroller && root) {
            initialize({
                elements: { viewport: scroller as HTMLElement },
                target: root,
            });

            if (allowDragScroll) {
                autoScrollForElements({
                    element: scroller as HTMLElement,
                    getAllowedAxis: () => 'vertical',
                    getConfiguration: () => ({ maxScrollSpeed: 'standard' }),
                });
            }
        }

        return () => osInstance()?.destroy();
    }, [allowDragScroll, initialize, osInstance, scroller]);

    const mergedRef = useMergedRef(ref, containerRef);

    return (
        <div
            ref={(el) => {
                setScroller(el);
                mergedRef(el);
            }}
            className={clsx(styles.scrollArea, className)}
            {...htmlProps}
        >
            {children}
        </div>
    );
});

ScrollArea.displayName = 'ScrollArea';
