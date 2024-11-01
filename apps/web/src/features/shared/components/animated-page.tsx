import { motion } from 'framer-motion';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import styles from './animated-page.module.scss';

export function AnimatedPage({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            animate="show"
            className={styles.container}
            exit="hidden"
            initial="hidden"
            style={{ height: '100%', width: '100%' }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            variants={animationVariants.fadeIn}
        >
            {children}
        </motion.div>
    );
}
