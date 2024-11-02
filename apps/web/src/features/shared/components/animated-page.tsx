import type { ReactNode } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import styles from './animated-page.module.scss';

interface AnimatedPageProps {
    children: ReactNode;
    className?: string;
}

export function AnimatedPage({ children, className }: AnimatedPageProps) {
    return (
        <motion.div
            animate="show"
            className={clsx(styles.container, className)}
            exit="hidden"
            initial="hidden"
            transition={{ duration: 1, ease: 'easeInOut' }}
            variants={animationVariants.fadeIn}
        >
            {children}
        </motion.div>
    );
}
