import type { PaginationProps as MantinePaginationProps } from '@mantine/core';
import { Pagination as MantinePagination } from '@mantine/core';
import clsx from 'clsx';
import {
    LuChevronFirst,
    LuChevronLast,
    LuChevronLeft,
    LuChevronRight,
    LuMinus,
} from 'react-icons/lu';
import { useContainerBreakpoints } from '@/hooks/use-container-query.ts';
import type { Sizes } from '@/themes/index.ts';
import type { Breakpoints } from '@/types.ts';
import styles from './pagination.module.scss';

interface PaginationProps {
    currentPage: number;
    hasControls?: boolean;
    hasEdges?: boolean;
    itemCount: number;
    itemsPerPage: number;
    justify?: 'start' | 'center' | 'end' | 'between';
    onFirstPage: () => void;
    onLastPage: () => void;
    onNextPage: () => void;
    onPageChange: (page: number) => void;
    onPreviousPage: () => void;
    pageSiblings?: number;
    radius?: Sizes;
    size?: Sizes;
    variant?: 'filled' | 'default' | 'primary' | 'subtle';
}

export function Pagination(props: PaginationProps) {
    const {
        currentPage,
        itemCount,
        itemsPerPage,
        onFirstPage,
        onLastPage,
        onNextPage,
        onPageChange,
        onPreviousPage,
        justify = 'end',
        size = 'md',
        variant = 'default',
        radius = 'md',
        hasControls,
        hasEdges,
        pageSiblings,
    } = props;

    const pageCount = Math.ceil(itemCount / itemsPerPage);

    const rootClassNames = clsx({
        [styles.root]: true,
        [styles[`justify-${justify}`]]: justify,
    });

    const controlClassNames = clsx({
        [styles.control]: true,
        [styles.filledVariant]: variant === 'filled',
        [styles.defaultVariant]: variant === undefined || variant === 'default',
        [styles.primaryVariant]: variant === 'primary',
        [styles.subtleVariant]: variant === 'subtle',
        [styles[`size-${size}`]]: true,
        [styles[`radius-${radius}`]]: true,
    });

    const dotsClassNames = clsx({
        [styles.dots]: true,
        [styles.filledVariant]: variant === 'filled',
        [styles.defaultVariant]: variant === undefined || variant === 'default',
        [styles.primaryVariant]: variant === 'primary',
        [styles.subtleVariant]: variant === 'subtle',
        [styles[`size-${size}`]]: true,
        [styles[`radius-${radius}`]]: true,
    });

    const classNames: MantinePaginationProps['classNames'] = {
        control: controlClassNames,
        dots: dotsClassNames,
        root: rootClassNames,
    };

    const { ref, breakpoints } = useContainerBreakpoints();

    const paginationProps = getResponsePaginationProps(breakpoints, {
        siblings: pageSiblings,
        withControls: hasControls,
        withEdges: hasEdges,
    });

    return (
        <MantinePagination
            ref={ref}
            unstyled
            classNames={classNames}
            dotsIcon={DotComponent}
            firstIcon={LuChevronFirst}
            lastIcon={LuChevronLast}
            nextIcon={LuChevronRight}
            previousIcon={LuChevronLeft}
            total={pageCount}
            value={currentPage}
            variant={variant}
            onChange={onPageChange}
            onFirstPage={onFirstPage}
            onLastPage={onLastPage}
            onNextPage={onNextPage}
            onPreviousPage={onPreviousPage}
            {...paginationProps}
        />
    );
}

function DotComponent() {
    return <LuMinus />;
}

function getResponsePaginationProps(
    breakpoints: Breakpoints,
    defaults: { siblings?: number; withControls?: boolean; withEdges?: boolean },
) {
    return {
        siblings:
            defaults.siblings ||
            (!breakpoints.isLargerThanSm ? 0 : !breakpoints.isLargerThanMd ? 1 : 2),
    };
}
