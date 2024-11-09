import type { ReactNode } from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

export function GridCarousel(props: GridCarouselProps) {
    const { cards, title, rowCount = 1, onNextPage, onPrevPage, loadNextPage } = props;

    const [currentPage, setCurrentPage] = useState(0);
    const { ref: containerRef, breakpoints } = useContainerBreakpoints();

    const handlePrevPage = useCallback(() => {
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : 0));
        onPrevPage(currentPage);
    }, [currentPage, onPrevPage]);

    const handleNextPage = useCallback(() => {
        setCurrentPage((prev) => prev + 1);
        onNextPage(currentPage);
    }, [currentPage, onNextPage]);

    const cardsToShow = getCardsToShow(breakpoints);

    const visibleCards = useMemo(() => {
        return cards.slice(
            currentPage * cardsToShow * rowCount,
            (currentPage + 1) * cardsToShow * rowCount,
        );
    }, [cards, currentPage, cardsToShow, rowCount]);

    const shouldLoadNextPage = visibleCards.length < cardsToShow * rowCount;

    useEffect(() => {
        if (shouldLoadNextPage) {
            loadNextPage?.();
        }
    }, [loadNextPage, shouldLoadNextPage]);

    const isPrevDisabled = currentPage === 0;
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
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={currentPage}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 0.2, ease: 'easeInOut' },
                    }}
                    className={styles.grid}
                    exit={{
                        opacity: 0,
                        scale: 0.95,
                        transition: { duration: 0.2, ease: 'easeInOut' },
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    style={{ '--row-count': rowCount } as React.CSSProperties}
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
        return 9;
    }

    if (breakpoints.isLargerThanXxl) {
        return 7;
    }

    if (breakpoints.isLargerThanXl) {
        return 6;
    }

    if (breakpoints.isLargerThanLg) {
        return 5;
    }

    if (breakpoints.isLargerThanMd) {
        return 4;
    }

    if (breakpoints.isLargerThanSm) {
        return 3;
    }

    return 2;
}
