import type { RefObject } from 'react';
import { useState } from 'react';
import clsx from 'clsx';
import { Fragment } from 'react/jsx-runtime';
import { MotionButton } from '@/features/ui/button/button.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { NumberInput } from '@/features/ui/number-input/number-input.tsx';
import { Popover } from '@/features/ui/popover/popover.tsx';
import { SelectInput } from '@/features/ui/select-input/select-input.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import { useContainerBreakpoints } from '@/hooks/use-container-query.ts';
import type { Sizes } from '@/themes/index.ts';
import type { Breakpoints } from '@/types.ts';
import styles from './pagination.module.scss';

interface PaginationProps {
    containerBreakpoints?: Breakpoints;
    containerRef?: RefObject<HTMLDivElement>;
    currentPage: number;
    hasControls?: boolean;
    hasEdges?: boolean;
    hasItemsPerPage?: boolean;
    itemCount: number;
    itemsPerPage: number;
    justify?: 'start' | 'center' | 'end' | 'between';
    onFirstPage: () => void;
    onItemsPerPageChange?: (e: string) => void;
    onLastPage: () => void;
    onNextPage: () => void;
    onPageChange: (page: number) => void;
    onPreviousPage: () => void;
    pageSiblings?: number;
    radius?: Sizes;
    size?: Sizes;
    variant?: 'filled' | 'default' | 'danger' | 'primary' | 'subtle' | 'transparent' | 'outline';
}

const itemsPerPageOptions = [
    { label: '50', value: '50' },
    { label: '100', value: '100' },
    { label: '200', value: '200' },
    { label: '250', value: '250' },
    { label: '500', value: '500' },
];

export function Pagination(props: PaginationProps) {
    const {
        containerBreakpoints,
        containerRef,
        currentPage,
        itemCount,
        itemsPerPage,
        onFirstPage,
        onLastPage,
        onNextPage,
        onPageChange,
        onPreviousPage,
        onItemsPerPageChange,
        justify = 'end',
        size = 'md',
        variant = 'default',
        radius = 'md',
        hasControls = true,
        hasEdges = false,
        hasItemsPerPage = false,
        pageSiblings,
    } = props;

    const pageCount = Math.ceil(itemCount / itemsPerPage);

    const rootClassNames = clsx({
        [styles.root]: true,
        [styles[`justify-${justify}`]]: justify,
    });

    const { ref, breakpoints } = useContainerBreakpoints();

    const componentBreakpoints = containerBreakpoints ?? breakpoints;

    const paginationProps = getResponsePaginationProps(componentBreakpoints, {
        siblings: pageSiblings,
        withControls: hasControls,
        withEdges: hasEdges,
    });

    return (
        <div ref={containerRef ?? ref} className={rootClassNames}>
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

            {hasItemsPerPage && componentBreakpoints.isLargerThanSm && (
                <SelectInput
                    data={itemsPerPageOptions}
                    size="sm"
                    value={itemsPerPage.toString()}
                    onChange={(e) => {
                        if (!e) return;
                        onItemsPerPageChange?.(e);
                    }}
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
            (breakpoints.isLargerThanLg ? 2 : breakpoints.isLargerThanMd ? 1 : 0),
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

export function PaginationWithCount(props: PaginationProps) {
    const { itemsPerPage, ...rest } = props;

    const start = (props.currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(props.currentPage * itemsPerPage, props.itemCount);

    const { ref: containerRef, breakpoints } = useContainerBreakpoints();

    return (
        <Group
            ref={containerRef}
            align="center"
            justify={breakpoints.isLargerThanSm ? 'between' : 'center'}
        >
            {breakpoints.isLargerThanSm && (
                <Group>
                    <Text isNoSelect>
                        {start} - {end} of {props.itemCount}
                    </Text>
                </Group>
            )}

            <Pagination
                hasItemsPerPage={true}
                {...rest}
                containerBreakpoints={breakpoints}
                containerRef={containerRef}
                itemsPerPage={itemsPerPage}
            />
        </Group>
    );
}
