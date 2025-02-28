import { SegmentedControl } from '@mantine/core';
import clsx from 'clsx';
import styles from './segmented-control.module.css';

export const SegmentedControlComponentOverride = SegmentedControl.extend({
    classNames: (_theme, props) => ({
        root: clsx(styles.root, {
            [styles.filled]: props.variant === 'filled',
        }),
    }),
    vars: () => ({
        root: {
            '--sc-color': 'var(--mantine-color-default-hover)',
        },
    }),
});
