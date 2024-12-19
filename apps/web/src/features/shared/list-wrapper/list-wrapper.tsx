import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import styles from './list-wrapper.module.scss';

interface ListWrapperProps {
    children: ReactNode;
    listKey?: string;
}

export function ListWrapper(props: ListWrapperProps) {
    const { children, listKey, ...rest } = props;

    return (
        <motion.div
            key={listKey}
            animate="show"
            className={styles.container}
            exit="hidden"
            id={listKey}
            initial="hidden"
            transition={{ duration: 0.3 }}
            variants={animationVariants.fadeIn}
            {...rest}
        >
            {children}
        </motion.div>
    );
}
