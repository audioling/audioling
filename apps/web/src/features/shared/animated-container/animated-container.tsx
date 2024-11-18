import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import type { Transition, Variants } from 'motion/react';
import { motion } from 'motion/react';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import styles from './animated-container.module.scss';

interface AnimatedContainerProps
    extends Omit<
        HTMLAttributes<HTMLDivElement>,
        'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onAnimationEnd' | 'onDrag'
    > {
    children: ReactNode;
    className?: string;
    transitionProps?: Transition;
    variants?: Variants;
}

export function AnimatedContainer(props: AnimatedContainerProps) {
    const { children, className, transitionProps, variants, ...htmlProps } = props;

    return (
        <motion.div
            animate="show"
            className={clsx(styles.container, className)}
            exit="hidden"
            initial="hidden"
            transition={{ duration: 0.5, ease: 'easeIn', ...transitionProps }}
            variants={variants ?? animationVariants.fadeIn}
            {...htmlProps}
        >
            {children}
        </motion.div>
    );
}
