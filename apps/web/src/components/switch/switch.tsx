import { Switch } from '@mantine/core';
import styles from './switch.module.css';

export const SwitchComponentOverride = Switch.extend({
    classNames: () => ({
        thumb: styles.thumb,
        track: styles.track,
    }),
});
