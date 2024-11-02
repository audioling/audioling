import type { ReactNode } from 'react';
import type { FloatingPosition, MenuProps as MantineMenuProps } from '@mantine/core';
import { Menu as MantineMenu } from '@mantine/core';
import styles from './menu.module.scss';

interface MenuProps {
    children: ReactNode;
    position?: FloatingPosition;
}

export function Menu(props: MenuProps) {
    const { children, position = 'bottom-start' } = props;

    const classNames: MantineMenuProps['classNames'] = {
        dropdown: styles.dropdown,
        item: styles.item,
    };

    return (
        <MantineMenu
            classNames={classNames}
            floatingStrategy="fixed"
            keepMounted={false}
            position={position}
            transitionProps={{ duration: 300, transition: 'scale-y' }}
        >
            {children}
        </MantineMenu>
    );
}

Menu.Target = MantineMenu.Target;
Menu.Dropdown = MantineMenu.Dropdown;
Menu.Label = MantineMenu.Label;
Menu.Item = MantineMenu.Item;
Menu.Divider = MantineMenu.Divider;
