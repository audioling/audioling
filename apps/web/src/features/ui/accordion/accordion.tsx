import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { useState } from 'react';
import clsx from 'clsx';
import { LayoutGroup, motion } from 'framer-motion';
import { Group } from '@/features/ui/group/group.tsx';
import type { AppIcon } from '@/features/ui/icon/icon.tsx';
import { Icon, MotionIcon } from '@/features/ui/icon/icon.tsx';
import styles from './accordion.module.scss';

interface AccordionProps {
    children: ReactNode;
    icon?: keyof typeof AppIcon;
    label: string;
    opened?: boolean;
    setOpened?: Dispatch<SetStateAction<boolean>>;
}

export function Accordion({ children, icon, opened = false, label, setOpened }: AccordionProps) {
    const [uncontrolledOpened, setUncontrolledOpened] = useState(opened);

    const isStateOpen = opened || uncontrolledOpened;

    const handleClick = () => {
        if (setOpened) {
            return setOpened((prev) => !prev);
        }

        return setUncontrolledOpened((prev) => !prev);
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
