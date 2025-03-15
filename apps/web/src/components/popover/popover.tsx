import type { MantineThemeComponent } from '@mantine/core';
import { Popover } from '@mantine/core';
import styles from './popover.module.css';

export const PopoverComponentOverride: MantineThemeComponent = Popover.extend({
    classNames: {
        dropdown: styles.dropdown,
    },
});
