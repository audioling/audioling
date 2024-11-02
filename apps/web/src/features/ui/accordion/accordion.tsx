import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { useState } from 'react';
import clsx from 'clsx';
import { LayoutGroup, motion } from 'framer-motion';
import { MotionIcon } from '@/features/ui/icon/icon.tsx';
import styles from './accordion.module.scss';

interface AccordionProps {
    children: ReactNode;
    isOpen?: boolean;
    label: string;
    setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

export function Accordion({ children, isOpen = false, label, setIsOpen }: AccordionProps) {
    const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(isOpen);

    const isStateOpen = isOpen || uncontrolledIsOpen;

    const handleClick = () => {
        if (setIsOpen) {
            return setIsOpen((prev) => !prev);
        }

        return setUncontrolledIsOpen((prev) => !prev);
    };

    return (
        <motion.div
            className={clsx(styles.accordion, {
                [styles.open]: isStateOpen,
            })}
        >
            <button className={styles.title} onClick={handleClick}>
                <div className={styles.titleContent}>
                    <span className={styles.label}>{label}</span>
                    <MotionIcon animate={{ rotate: isStateOpen ? 90 : 0 }} icon="arrowRightS" />
                </div>
            </button>
            <motion.div
                layout
                animate={{
                    height: isStateOpen ? 'auto' : '0px',
                    opacity: isStateOpen ? 1 : 0,
                    overflow: 'hidden',
                    userSelect: 'none',
                }}
                className={styles.content}
                exit={{ height: '0px', opacity: 0, overflow: 'hidden', userSelect: 'none' }}
                style={{ overflow: 'hidden', userSelect: 'none' }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}

function AccordionGroup({ children }: { children: ReactNode }) {
    return (
        <LayoutGroup>
            <div className={styles.group}>{children}</div>
        </LayoutGroup>
    );
}

Accordion.Group = AccordionGroup;
