import { type ReactNode, useEffect } from 'react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { Divider } from '@/features/ui/divider/divider.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
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
    const { children, closeOnClickOutside = false, isClosing, onClose, size = 'md', title } = props;

    const ref = useClickOutside(closeOnClickOutside ? onClose : () => {});
    const focusTrapRef = useFocusTrap();
    const mergedRef = useMergedRef(ref, focusTrapRef);

    const modalClassNames = clsx(styles.modal, {
        [styles.modalSm]: size === 'sm',
        [styles.modalMd]: size === 'md',
        [styles.modalLg]: size === 'lg',
    });

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscapeKey);

        return () => window.removeEventListener('keydown', handleEscapeKey);
    }, [isClosing, onClose]);

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
                variants={animationVariants.combine(
                    animationVariants.fadeIn,
                    animationVariants.zoomIn,
                )}
            >
                <Group justify="between">
                    <h1 className={styles.title}>{title}</h1>
                    <IconButton icon="x" variant="subtle" onClick={onClose} />
                </Group>
                <Divider orientation="horizontal" />
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
