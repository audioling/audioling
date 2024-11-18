import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import styles from './list-wrapper.module.scss';

interface ListWrapperProps {
    children: ReactNode;
    id: string;
    listKey: string;
}

export function ListWrapper(props: ListWrapperProps) {
    const { children, id, listKey, ...rest } = props;

    return (
        <motion.div
            key={listKey}
            animate="show"
            className={styles.container}
            id={id}
            initial="hidden"
            transition={{ duration: 0.5 }}
            variants={animationVariants.fadeIn}
            {...rest}
        >
            {children}
        </motion.div>
    );
}
