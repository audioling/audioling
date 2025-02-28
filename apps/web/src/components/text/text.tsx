import { Text as MantineText } from '@mantine/core';
import clsx from 'clsx';
import styles from './text.module.css';

export const TextComponentOverride = MantineText.extend({
    classNames: (_theme, props) => ({
        root: clsx({
            [styles.centered]: props.isCentered,
            [styles.ellipsis]: props.isEllipsis,
            [styles.monospace]: props.isMonospace,
            [styles.uppercase]: props.isUppercase,
            [styles.noSelect]: props.isNoSelect,
            [styles.secondary]: props.isSecondary,
        }),
    }),
    defaultProps: {
        isNoSelect: true,
    },
});
