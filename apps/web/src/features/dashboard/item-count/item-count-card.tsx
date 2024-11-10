import { useState } from 'react';
import { motion } from 'framer-motion';
import type { LinkProps } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { Icon } from '@/features/ui/icon/icon.tsx';
import { Paper } from '@/features/ui/paper/paper.tsx';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { Title } from '@/features/ui/title/title.tsx';
import styles from './item-count-card.module.scss';

interface ItemCountCardProps extends LinkProps {
    count: number;
    isLoading?: boolean;
    label: string;
}

export function ItemCountCard({ count, isLoading, label, to }: ItemCountCardProps) {
    const [showArrow, setShowArrow] = useState(false);
    const countLabel = convertCountLabel(count);

    if (isLoading) {
        return <Skeleton height="100%" width="100%" />;
    }

    return (
        <Paper className={styles.container}>
            <Link
                to={to || '/'}
                onMouseEnter={(e) => {
                    e.stopPropagation();
                    setShowArrow(true);
                }}
                onMouseLeave={(e) => {
                    e.stopPropagation();
                    setShowArrow(false);
                }}
            >
                <div className={styles.content}>
                    <Stack gap="xs">
                        <Title order={1} size="sm" weight="sm">
                            {label.toLocaleUpperCase()}
                        </Title>
                        <Title order={2} size="lg" weight="md">
                            {countLabel}
                        </Title>
                    </Stack>
                    {showArrow && (
                        <motion.div
                            className={styles.arrow}
                            variants={animationVariants.slideInRight}
                        >
                            <Icon icon="arrowRightS" size="xl" />
                        </motion.div>
                    )}
                </div>
            </Link>
        </Paper>
    );
}

function convertCountLabel(count: number) {
    if (count < 1000) {
        return count;
    }

    return `${(count / 1000).toFixed(1)}K`;
}
