import { type ReactNode, useState } from 'react';
import { Tooltip as MantineTooltip } from '@mantine/core';
import type { FloatingPosition, TooltipProps as MantineTooltipProps } from '@mantine/core';
import styles from './tooltip.module.scss';

export interface TooltipProps {
    children: ReactNode;
    label: string;
    position?: FloatingPosition;
}

export function Tooltip(props: TooltipProps) {
    const { children, label, position = 'top' } = props;
    const [opened, setOpened] = useState(false);

    const tooltipClassNames: MantineTooltipProps['classNames'] = {
        tooltip: styles.tooltip,
    };

    return (
        <MantineTooltip
            classNames={tooltipClassNames}
            floatingStrategy="fixed"
            keepMounted={false}
            label={label}
            opened={opened}
            position={position}
            transitionProps={{ duration: 300, transition: 'pop' }}
        >
            <div
                className="al-tooltip-target"
                onClick={() => setOpened(false)}
                onMouseEnter={() => setOpened(true)}
                onMouseLeave={() => setOpened(false)}
            >
                {children}
            </div>
        </MantineTooltip>
    );
}
