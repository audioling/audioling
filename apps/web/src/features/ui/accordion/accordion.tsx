import type { ReactNode } from 'react';
import { forwardRef, useState } from 'react';
import clsx from 'clsx';
import type { Variants } from 'motion/react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
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

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
    ({ children, icon, label, onOpenedChange, opened = false }, ref) => {
        const [uncontrolledOpened, setUncontrolledOpened] = useState(opened);

        const isStateOpen = opened || uncontrolledOpened;

        const handleClick = () => {
            onOpenedChange?.(isStateOpen);
            setUncontrolledOpened((prev) => {
                return !prev;
            });
        };

        return (
            <motion.div ref={ref} className={clsx(styles.accordion)}>
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
    },
);

Accordion.displayName = 'Accordion';

function AccordionGroup({ children }: { children: ReactNode }) {
    return (
        <LayoutGroup>
            <div className={styles.group}>{children}</div>
        </LayoutGroup>
    );
}

const AccordionNamespace = Object.assign(Accordion, { Group: AccordionGroup });

export { AccordionNamespace as Accordion };
