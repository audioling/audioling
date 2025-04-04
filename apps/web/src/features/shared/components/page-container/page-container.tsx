import type { HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import styles from './page-container.module.css';
import { animationVariants } from '/@/components/animations/variants';

interface PageContainerProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
    children: ReactNode;
}

export function PageContainer(props: PageContainerProps) {
    const { children, className, ...htmlProps } = props;

    return (
        <motion.div
            animate="show"
            className={clsx(styles.container, className)}
            initial="hidden"
            variants={animationVariants.combine(animationVariants.fadeIn)}
            {...htmlProps}
        >
            {children}
        </motion.div>
    );
}
