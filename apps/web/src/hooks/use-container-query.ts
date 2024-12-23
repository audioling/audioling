import { useEffect, useState } from 'react';
import { useResizeObserver } from '@/hooks/use-element-size.ts';
import type { Breakpoints } from '@/types.ts';

export function useContainerBreakpoints() {
    const [ref, rect] = useResizeObserver();
    const [globalBreakpoints, setGlobalBreakpoints] = useState({
        lg: 0,
        md: 0,
        sm: 0,
        xl: 0,
        xxl: 0,
        xxxl: 0,
    });

    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);

        const getBreakpointValue = (breakpoint: string) => {
            const rootFontSize = 16;
            const value = computedStyle.getPropertyValue(`--breakpoint-${breakpoint}`).trim();
            return parseInt(value, 10) * rootFontSize || 0;
        };

        setGlobalBreakpoints({
            lg: getBreakpointValue('lg'),
            md: getBreakpointValue('md'),
            sm: getBreakpointValue('sm'),
            xl: getBreakpointValue('xl'),
            xxl: getBreakpointValue('xxl'),
            xxxl: getBreakpointValue('xxxl'),
        });
    }, []);

    const isLargerThanSm = rect?.width >= globalBreakpoints.sm;
    const isLargerThanMd = rect?.width >= globalBreakpoints.md;
    const isLargerThanLg = rect?.width >= globalBreakpoints.lg;
    const isLargerThanXl = rect?.width >= globalBreakpoints.xl;
    const isLargerThanXxl = rect?.width >= globalBreakpoints.xxl;
    const isLargerThanXxxl = rect?.width >= globalBreakpoints.xxxl;

    const breakpoints: Breakpoints = {
        isLargerThanLg,
        isLargerThanMd,
        isLargerThanSm,
        isLargerThanXl,
        isLargerThanXxl,
        isLargerThanXxxl,
    };

    return { breakpoints, rect, ref };
}
