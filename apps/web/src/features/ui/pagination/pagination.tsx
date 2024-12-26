import { useState } from 'react';
import clsx from 'clsx';
import { Fragment } from 'react/jsx-runtime';
import { MotionButton } from '@/features/ui/button/button.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { NumberInput } from '@/features/ui/number-input/number-input.tsx';
import { Popover } from '@/features/ui/popover/popover.tsx';
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
    variant?: 'filled' | 'default' | 'danger' | 'primary' | 'subtle' | 'transparent' | 'outline';
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
        hasControls = true,
        hasEdges = false,
        pageSiblings,
    } = props;

    const pageCount = Math.ceil(itemCount / itemsPerPage);

    const rootClassNames = clsx({
        [styles.root]: true,
        [styles[`justify-${justify}`]]: justify,
    });

    const { ref, breakpoints } = useContainerBreakpoints();

    const paginationProps = getResponsePaginationProps(breakpoints, {
        siblings: pageSiblings,
        withControls: hasControls,
        withEdges: hasEdges,
    });

    return (
        <div ref={ref} className={rootClassNames}>
            {hasEdges && (
                <IconButton
                    aria-label="First page"
                    className={styles.iconControl}
                    disabled={currentPage === 1}
                    icon="arrowLeftToLine"
                    radius={radius}
                    size={size}
                    variant={variant}
                    onClick={onFirstPage}
                />
            )}

            {hasControls && (
                <IconButton
                    aria-label="Previous page"
                    className={styles.iconControl}
                    disabled={currentPage === 1}
                    icon="arrowLeftS"
                    radius={radius}
                    size={size}
                    variant={variant}
                    onClick={onPreviousPage}
                />
            )}

            {Array.from({ length: pageCount }, (_, i) => i + 1)
                .filter((page) => {
                    const siblings = paginationProps.siblings;
                    const isFirstPage = page === 1;
                    const isCurrentPage = page === currentPage;
                    const isRightSibling = page > currentPage && page <= currentPage + siblings;
                    const isLeftSibling =
                        page < currentPage && page >= Math.max(2, currentPage - siblings);

                    return isFirstPage || isCurrentPage || isRightSibling || isLeftSibling;
                })
                .map((page, index, array) => {
                    if (array[array.length - 1] !== pageCount && page === array[array.length - 1]) {
                        return (
                            <Fragment key={`last-section-${page}`}>
                                <MotionButton
                                    key={page}
                                    radius={radius}
                                    size={size}
                                    variant={page === currentPage ? 'primary' : variant}
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </MotionButton>
                                <GoToPageButton
                                    currentPage={currentPage}
                                    pageCount={pageCount}
                                    radius={radius}
                                    size={size}
                                    variant={variant}
                                    onPageChange={onPageChange}
                                />
                                <MotionButton
                                    key={pageCount}
                                    radius={radius}
                                    size={size}
                                    variant={pageCount === currentPage ? 'primary' : variant}
                                    onClick={() => onPageChange(pageCount)}
                                >
                                    {pageCount}
                                </MotionButton>
                            </Fragment>
                        );
                    }

                    if (index > 0 && array[index - 1] !== page - 1) {
                        return (
                            <Fragment key={`dots-${page}`}>
                                <GoToPageButton
                                    currentPage={currentPage}
                                    pageCount={pageCount}
                                    radius={radius}
                                    size={size}
                                    variant={variant}
                                    onPageChange={onPageChange}
                                />
                                <MotionButton
                                    key={page}
                                    radius={radius}
                                    size={size}
                                    variant={page === currentPage ? 'primary' : variant}
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </MotionButton>
                            </Fragment>
                        );
                    }

                    return (
                        <MotionButton
                            key={page}
                            radius={radius}
                            size={size}
                            variant={page === currentPage ? 'primary' : variant}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </MotionButton>
                    );
                })}

            {hasControls && (
                <IconButton
                    aria-label="Next page"
                    className={styles.iconControl}
                    disabled={currentPage === pageCount}
                    icon="arrowRightS"
                    radius={radius}
                    size={size}
                    variant={variant}
                    onClick={onNextPage}
                />
            )}

            {hasEdges && (
                <IconButton
                    aria-label="Last page"
                    className={styles.iconControl}
                    disabled={currentPage === pageCount}
                    icon="arrowRightToLine"
                    radius={radius}
                    size={size}
                    variant={variant}
                    onClick={onLastPage}
                />
            )}
        </div>
    );
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

function GoToPageButton(props: {
    currentPage: number;
    onPageChange: (page: number) => void;
    pageCount: number;
    radius: Sizes;
    size: Sizes;
    variant?: 'filled' | 'default' | 'danger' | 'primary' | 'subtle' | 'transparent' | 'outline';
}) {
    const { radius, size, variant, onPageChange, currentPage, pageCount } = props;

    const [goToPage, setGoToPage] = useState(currentPage);

    return (
        <Popover align="center" side="top">
            <Popover.Target>
                <IconButton
                    className={styles.iconControl}
                    icon="ellipsisHorizontal"
                    radius={radius}
                    size={size}
                    variant={variant}
                />
            </Popover.Target>
            <Popover.Content>
                <form>
                    <Group gap="sm" p="sm">
                        <NumberInput
                            max={pageCount}
                            min={1}
                            style={{ width: '100px' }}
                            value={goToPage}
                            onChange={(e) => setGoToPage(e)}
                        />
                        <IconButton
                            icon="arrowRight"
                            type="submit"
                            variant="outline"
                            onClick={(e) => {
                                e.preventDefault();
                                if (goToPage) {
                                    onPageChange(goToPage);
                                }
                            }}
                        />
                    </Group>
                </form>
            </Popover.Content>
        </Popover>
    );
}
