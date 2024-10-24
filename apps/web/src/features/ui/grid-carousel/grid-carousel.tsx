import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
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

export function GridCarousel(props: GridCarouselProps) {
    const { cards, title, rowCount = 1, onNextPage, onPrevPage, loadNextPage } = props;

    const [currentPage, setCurrentPage] = useState(0);
    const { ref: containerRef, breakpoints } = useContainerBreakpoints();
    const cardsToShow = useRef(2);

    const handlePrevPage = () => {
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : 0));
        onPrevPage(currentPage);
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
        onNextPage(currentPage);
    };

    const visibleCards = useMemo(() => {
        if (breakpoints.isLargerThanSm) {
            cardsToShow.current = 4;
        }

        if (breakpoints.isLargerThanMd) {
            cardsToShow.current = 5;
        }

        if (breakpoints.isLargerThanLg) {
            cardsToShow.current = 6;
        }

        if (breakpoints.isLargerThanXl) {
            cardsToShow.current = 8;
        }

        if (breakpoints.isLargerThanXxl) {
            cardsToShow.current = 10;
        }

        return cards.slice(
            currentPage * cardsToShow.current * rowCount,
            (currentPage + 1) * cardsToShow.current * rowCount,
        );
    }, [
        breakpoints.isLargerThanLg,
        breakpoints.isLargerThanMd,
        breakpoints.isLargerThanSm,
        breakpoints.isLargerThanXl,
        breakpoints.isLargerThanXxl,
        cards,
        currentPage,
        rowCount,
    ]);

    const shouldLoadNextPage = visibleCards.length < cardsToShow.current * rowCount;

    useEffect(() => {
        if (shouldLoadNextPage) {
            loadNextPage?.();
        }
    }, [loadNextPage, shouldLoadNextPage]);

    const isPrevDisabled = currentPage === 0;
    const isNextDisabled = visibleCards.length < cardsToShow.current * rowCount;

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
                        <div key={card.id} className={styles.card}>
                            {card.content}
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}
