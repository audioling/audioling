import type { ReactNode } from 'react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { useClickOutside } from '@/hooks/use-click-outside.ts';
import { useFocusTrap } from '@/hooks/use-focus-trap.ts';
import { useMergedRef } from '@/hooks/use-merged-ref.ts';
import styles from './modal.module.scss';

interface ModalProps {
    children: ReactNode;
    closeOnClickOutside?: boolean;
    isClosing: boolean;
    onClose: () => void;
    size?: 'sm' | 'md' | 'lg';
    title: string;
}

export function Modal(props: ModalProps) {
    const { children, closeOnClickOutside = true, isClosing, onClose, size = 'md', title } = props;

    const ref = useClickOutside(closeOnClickOutside ? onClose : () => {});
    const focusTrapRef = useFocusTrap();
    const mergedRef = useMergedRef(ref, focusTrapRef);

    const modalClassNames = clsx(styles.modal, {
        [styles.modalSm]: size === 'sm',
        [styles.modalMd]: size === 'md',
        [styles.modalLg]: size === 'lg',
    });

    return (
        <motion.div
            animate={isClosing ? 'hidden' : 'show'}
            className={styles.overlay}
            exit="hidden"
            initial="hidden"
            transition={{ duration: 0.3, ease: 'linear' }}
            variants={{
                hidden: {},
                show: { backdropFilter: 'blur(2px)' },
            }}
        >
            <motion.div
                ref={mergedRef}
                animate={isClosing ? 'hidden' : 'show'}
                className={modalClassNames}
                exit="hidden"
                initial="hidden"
                transition={{ duration: 0.3, ease: 'anticipate' }}
                variants={animationVariants.zoomIn}
            >
                <h1 className={styles.title}>{title}</h1>
                <div className={styles.content}>{children}</div>
            </motion.div>
        </motion.div>
    );
}

interface ButtonGroupProps {
    children: ReactNode;
}

function ButtonGroup(props: ButtonGroupProps) {
    const { children } = props;

    return <div className={styles.buttonGroup}>{children}</div>;
}

Modal.ButtonGroup = ButtonGroup;
