import type { ReactNode } from 'react';
import { useState } from 'react';
import clsx from 'clsx';
import type { Variants } from 'framer-motion';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Group } from '@/features/ui/group/group.tsx';
import type { AppIcon } from '@/features/ui/icon/icon.tsx';
import { Icon, MotionIcon } from '@/features/ui/icon/icon.tsx';
import styles from './accordion.module.scss';

interface AccordionProps {
    children: ReactNode;
    icon?: keyof typeof AppIcon;
    label: string;
    onOpenedChange?: (opened: boolean) => void;
    opened?: boolean;
}

const variants: Variants = {
    hidden: { height: '0px', opacity: 0 },
    show: { height: 'auto', opacity: 1 },
};

export function Accordion({
    children,
    icon,
    label,
    onOpenedChange,
    opened = false,
}: AccordionProps) {
    const [uncontrolledOpened, setUncontrolledOpened] = useState(opened);

    const isStateOpen = opened || uncontrolledOpened;

    const handleClick = () => {
        onOpenedChange?.(isStateOpen);
        setUncontrolledOpened((prev) => {
            return !prev;
        });
    };

    return (
        <motion.div className={clsx(styles.accordion)}>
            <button className={styles.title} onClick={handleClick}>
                <div className={styles.titleContent}>
                    <Group gap="sm">
                        {icon && <Icon icon={icon} />}
                        <span className={styles.label}>{label}</span>
                    </Group>
                    <MotionIcon animate={{ rotate: isStateOpen ? 90 : 0 }} icon="arrowRightS" />
                </div>
            </button>
            <AnimatePresence initial={false}>
                {isStateOpen && (
                    <motion.div
                        layout
                        animate="show"
                        className={styles.content}
                        exit="hidden"
                        initial="hidden"
                        style={{ overflow: 'hidden', userSelect: 'none' }}
                        variants={variants}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
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
