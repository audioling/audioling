import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useClickOutside } from '@/hooks/use-click-outside.ts';
import styles from './modal.module.scss';

interface ModalProps {
    children: ReactNode;
    isClosing: boolean;
    onClose: () => void;
    title: string;
}

export function Modal(props: ModalProps) {
    const { children, isClosing, onClose, title } = props;

    const ref = useClickOutside(onClose);

    return (
        <div className={styles.overlay}>
            <motion.div
                ref={ref}
                animate={isClosing ? 'hidden' : 'show'}
                className={styles.modal}
                exit="hidden"
                initial="hidden"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                variants={{
                    hidden: { opacity: 0, y: -200 },
                    show: { opacity: 1, y: 0 },
                }}
            >
                <h1 className={styles.title}>{title}</h1>
                <div className={styles.content}>{children}</div>
            </motion.div>
        </div>
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
