import type { ReactNode } from 'react';
import * as RTooltip from '@radix-ui/react-tooltip';
import { motion } from 'motion/react';
import styles from './tooltip.module.css';
import { animationVariants } from '/@/components/animations/variants';

export interface TooltipProps {
    children: ReactNode;
    isOpen?: boolean;
    label: string | ReactNode;
    openDelay?: number;
    position?: 'top' | 'right' | 'bottom' | 'left';
}

export function Tooltip(props: TooltipProps) {
    const { children, isOpen, label, openDelay = 0, position = 'top' } = props;

    return (
        <RTooltip.Provider disableHoverableContent delayDuration={openDelay}>
            <RTooltip.Root open={isOpen}>
                <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
                <RTooltip.Portal>
                    <RTooltip.Content
                        asChild
                        className={styles.tooltip}
                        side={position}
                        sideOffset={5}
                    >
                        <motion.div variants={animationVariants.combine(animationVariants.fadeIn)}>
                            {label}
                        </motion.div>
                    </RTooltip.Content>
                </RTooltip.Portal>
            </RTooltip.Root>
        </RTooltip.Provider>
    );
}
