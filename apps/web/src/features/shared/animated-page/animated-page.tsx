import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import styles from './animated-page.module.scss';

interface AnimatedPageProps
    extends Omit<
        HTMLAttributes<HTMLDivElement>,
        'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onAnimationEnd' | 'onDrag'
    > {
    children: ReactNode;
    className?: string;
}

export function AnimatedPage(props: AnimatedPageProps) {
    const { children, className, ...htmlProps } = props;

    return (
        <motion.div
            animate="show"
            className={clsx(styles.container, className)}
            exit="hidden"
            initial="hidden"
            transition={{ duration: 0.5, ease: 'easeIn' }}
            variants={animationVariants.fadeIn}
            {...htmlProps}
        >
            {children}
        </motion.div>
    );
}
