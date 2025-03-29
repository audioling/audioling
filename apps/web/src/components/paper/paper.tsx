import { Paper } from '@mantine/core';
import styles from './paper.module.css';

export const PaperComponentOverride = Paper.extend({
    classNames: {
        root: styles.root,
    },
});
