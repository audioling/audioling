import type { Ref } from 'react';
import { forwardRef, useEffect, useRef } from 'react';
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
    const { as, children, scrollHideDelay, ...htmlProps } = props;

    const containerRef = useRef(null);

    const [initialize] = useOverlayScrollbars({
        defer: false,

        options: {
            overflow: { x: 'hidden', y: 'scroll' },
            scrollbars: {
                autoHide: 'leave',
                autoHideDelay: scrollHideDelay || 500,
                pointers: ['mouse', 'pen', 'touch'],
                theme: 'app',
                visibility: 'visible',
            },
        },
    });

    useEffect(() => {
        if (containerRef.current) {
            initialize(containerRef.current as HTMLDivElement);
        }
    }, [initialize]);

    const mergedRef = useMergedRef(ref, containerRef);

    return (
        <Box ref={mergedRef} as={as} className={styles.scrollArea} {...htmlProps}>
            {children}
        </Box>
    );
});

ScrollArea.displayName = 'ScrollArea';
