import type { Ref } from 'react';
import { forwardRef, useEffect, useRef } from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { clsx } from 'clsx';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { Box } from '@/features/ui/box/box.tsx';
import { useMergedRef } from '@/hooks/use-merged-ref.ts';
import type { PolymorphicComponentType } from '@/types.ts';
import styles from './scroll-area.module.scss';

interface ScrollAreaProps extends React.ComponentPropsWithoutRef<'div'> {
    as?: PolymorphicComponentType;
    children: React.ReactNode;
    debugScrollPosition?: boolean;
    // noHeader?: boolean;
    // scrollBarOffset?: string;
    scrollHideDelay?: number;
}

export const ScrollArea = forwardRef((props: ScrollAreaProps, ref: Ref<HTMLDivElement>) => {
    const { as, children, className, scrollHideDelay, ...htmlProps } = props;

    const containerRef = useRef(null);

    const [initialize] = useOverlayScrollbars({
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
        if (containerRef.current) {
            initialize(containerRef.current as HTMLDivElement);
            autoScrollForElements({ element: containerRef.current as HTMLElement });
        }
    }, [initialize]);

    const mergedRef = useMergedRef(ref, containerRef);

    return (
        <Box ref={mergedRef} as={as} className={clsx(styles.scrollArea, className)} {...htmlProps}>
            {children}
        </Box>
    );
});

ScrollArea.displayName = 'ScrollArea';
