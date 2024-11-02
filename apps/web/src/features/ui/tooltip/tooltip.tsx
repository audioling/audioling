import type { ReactNode } from 'react';
import { Tooltip as MantineTooltip } from '@mantine/core';
import type { FloatingPosition, TooltipProps as MantineTooltipProps } from '@mantine/core';
import styles from './tooltip.module.scss';

export interface TooltipProps {
    children: ReactNode;
    label: string;
    openDelay?: number;
    position?: FloatingPosition;
}

export function Tooltip(props: TooltipProps) {
    const { children, label, openDelay = 0, position = 'top' } = props;

    const tooltipClassNames: MantineTooltipProps['classNames'] = {
        tooltip: styles.tooltip,
    };

    return (
        <MantineTooltip
            classNames={tooltipClassNames}
            floatingStrategy="fixed"
            keepMounted={false}
            label={label}
            openDelay={openDelay}
            position={position}
        >
            {children}
        </MantineTooltip>
    );
}
