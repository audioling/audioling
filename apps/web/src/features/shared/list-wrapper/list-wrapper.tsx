import { type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import styles from './list-wrapper.module.scss';

interface ListWrapperProps {
    children: ReactNode;
    listKey?: string;
}

export function ListWrapper(props: ListWrapperProps) {
    const { children, listKey } = props;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={listKey}
                animate="show"
                className={styles.container}
                initial="hidden"
                transition={{ duration: 0.3 }}
                variants={animationVariants.fadeIn}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
