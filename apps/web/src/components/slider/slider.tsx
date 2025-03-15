import { Slider } from '@mantine/core';
import styles from './slider.module.css';

export const SliderComponentOverride = Slider.extend({
    classNames: {
        bar: styles.bar,
        label: styles.label,
        root: styles.root,
        thumb: styles.thumb,
        track: styles.track,
    },
    defaultProps: {
        size: 'sm',
    },
});
