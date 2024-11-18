import type { ReactNode } from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { Variants } from 'motion/react';
import { AnimatePresence, motion } from 'motion/react';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { Title } from '@/features/ui/title/title.tsx';
import { useContainerBreakpoints } from '@/hooks/use-container-query.ts';
import styles from './grid-carousel.module.scss';

interface Card {
    content: ReactNode;
    id: string;
}

interface GridCarouselProps {
    cards: Card[];
    loadNextPage?: () => void;
    onNextPage: (page: number) => void;
    onPrevPage: (page: number) => void;
    rowCount?: number;
    title?: string;
}

const MemoizedCard = memo(({ content }: { content: ReactNode }) => (
    <div className={styles.card}>{content}</div>
));

MemoizedCard.displayName = 'MemoizedCard';

const pageVariants: Variants = {
    animate: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' }, x: 0 },
    exit: (custom: { isNext: boolean }) => ({
        opacity: 0,
        transition: { duration: 0.3, ease: 'easeIn' },
        x: custom.isNext ? -100 : 100,
    }),
    initial: (custom: { isNext: boolean }) => ({ opacity: 0, x: custom.isNext ? 100 : -100 }),
};

export function GridCarousel(props: GridCarouselProps) {
    const { cards, title, rowCount = 1, onNextPage, onPrevPage, loadNextPage } = props;
    const { ref: containerRef, breakpoints } = useContainerBreakpoints();

    const [currentPage, setCurrentPage] = useState({
        isNext: false,
        page: 0,
    });

    const handlePrevPage = useCallback(() => {
        setCurrentPage((prev) => ({
            isNext: false,
            page: prev.page > 0 ? prev.page - 1 : 0,
        }));
        onPrevPage(currentPage.page);
    }, [currentPage, onPrevPage]);

    const handleNextPage = useCallback(() => {
        setCurrentPage((prev) => ({
            isNext: true,
            page: prev.page + 1,
        }));
        onNextPage(currentPage.page);
    }, [currentPage, onNextPage]);

    const cardsToShow = getCardsToShow(breakpoints);

    const visibleCards = useMemo(() => {
        return cards.slice(
            currentPage.page * cardsToShow * rowCount,
            (currentPage.page + 1) * cardsToShow * rowCount,
        );
    }, [cards, currentPage, cardsToShow, rowCount]);

    const shouldLoadNextPage = visibleCards.length < cardsToShow * rowCount;

    useEffect(() => {
        if (shouldLoadNextPage) {
            loadNextPage?.();
        }
    }, [loadNextPage, shouldLoadNextPage]);

    const isPrevDisabled = currentPage.page === 0;
    const isNextDisabled = visibleCards.length < cardsToShow * rowCount;

    return (
        <motion.div ref={containerRef} className={styles.gridCarousel}>
            <div className={styles.navigation}>
                <Title order={1} size="lg">
                    {title}
                </Title>
                <Group gap="xs" justify="end">
                    <IconButton
                        disabled={isPrevDisabled}
                        icon="arrowLeftS"
                        size="lg"
                        variant="default"
                        onClick={handlePrevPage}
                    />
                    <IconButton
                        disabled={isNextDisabled}
                        icon="arrowRightS"
                        size="lg"
                        variant="default"
                        onClick={handleNextPage}
                    />
                </Group>
            </div>
            <AnimatePresence custom={currentPage} initial={false} mode="wait">
                <motion.div
                    key={currentPage.page}
                    animate="animate"
                    className={styles.grid}
                    custom={currentPage}
                    exit="exit"
                    initial="initial"
                    style={{ '--row-count': rowCount } as React.CSSProperties}
                    variants={pageVariants}
                >
                    {visibleCards.map((card) => (
                        <MemoizedCard key={card.id} content={card.content} />
                    ))}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}

function getCardsToShow(breakpoints: {
    isLargerThanLg: boolean;
    isLargerThanMd: boolean;
    isLargerThanSm: boolean;
    isLargerThanXl: boolean;
    isLargerThanXxl: boolean;
    isLargerThanXxxl: boolean;
}) {
    if (breakpoints.isLargerThanXxxl) {
        return 10;
    }

    if (breakpoints.isLargerThanXxl) {
        return 9;
    }

    if (breakpoints.isLargerThanXl) {
        return 7;
    }

    if (breakpoints.isLargerThanLg) {
        return 6;
    }

    if (breakpoints.isLargerThanMd) {
        return 5;
    }

    if (breakpoints.isLargerThanSm) {
        return 4;
    }

    return 2;
}
