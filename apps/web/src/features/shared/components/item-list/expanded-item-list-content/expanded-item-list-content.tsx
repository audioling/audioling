import { motion } from 'motion/react';
import { Suspense } from 'react';
import styles from './expanded-item-list-content.module.css';
import { animationVariants } from '/@/components/animations/variants';
import { ExpandedAlbumListContent } from '/@/features/albums/components/expanded-album-list-content';

export function ExpandedItemListContent({ id }: { id: string }) {
    return (
        <motion.div
            animate="show"
            className={styles.container}
            exit="hidden"
            initial="hidden"
            variants={animationVariants.fadeIn}
        >
            <Suspense fallback={<></>}>
                <ExpandedAlbumListContent
                    id={id}
                />
            </Suspense>
        </motion.div>
    );
}
