import { type ReactNode, useEffect, useRef, useState } from 'react';
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
    const [opened, setOpened] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    const tooltipClassNames: MantineTooltipProps['classNames'] = {
        tooltip: styles.tooltip,
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => {
            setOpened(true);
        }, openDelay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setOpened(false);
    };

    const handleClick = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setOpened(false);
    };

    return (
        <MantineTooltip
            classNames={tooltipClassNames}
            floatingStrategy="fixed"
            keepMounted={false}
            label={label}
            openDelay={openDelay}
            opened={opened}
            position={position}
            transitionProps={{ duration: 300, transition: 'pop' }}
        >
            <div
                className="al-tooltip-target"
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </div>
        </MantineTooltip>
    );
}
