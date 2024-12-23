import { type ReactNode } from 'react';
import * as RTooltip from '@radix-ui/react-tooltip';
import { motion } from 'motion/react';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import styles from './tooltip.module.scss';

export interface TooltipProps {
    children: ReactNode;
    label: string;
    openDelay?: number;
    position?: 'top' | 'right' | 'bottom' | 'left';
}

export function Tooltip(props: TooltipProps) {
    const { children, label, openDelay = 0, position = 'top' } = props;

    return (
        <RTooltip.Provider disableHoverableContent delayDuration={openDelay}>
            <RTooltip.Root>
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
