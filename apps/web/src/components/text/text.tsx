import { Text as MantineText } from '@mantine/core';
import clsx from 'clsx';
import { motion } from 'motion/react';
import styles from './text.module.css';

export const TextComponentOverride = MantineText.extend({
    classNames: (_theme, props) => ({
        root: clsx({
            [styles.noSelect]: true,
            [styles.secondary]: props.variant === 'secondary' || props.variant === 'secondary-ellipsis',
            [styles.ellipsis]: props.variant === 'default-ellipsis' || props.variant === 'secondary-ellipsis',
            [styles.monospace]: props.variant === 'monospace' || props.variant === 'monospace-secondary',
        }),
    }),
});

export const MotionText = motion.create(MantineText as any);
