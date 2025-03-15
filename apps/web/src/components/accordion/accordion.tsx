import { Accordion } from '@mantine/core';
import styles from './accordion.module.css';
import { Icon } from '/@/components/icon/icon';

export const AccordionComponentOverride = Accordion.extend({
    classNames: {
        chevron: styles.chevron,
        content: styles.content,
        control: styles.control,
        item: styles.item,
        label: styles.label,
        panel: styles.panel,
        root: styles.root,
    },
    defaultProps: {
        chevron: <Icon icon="arrowRightS" size="sm" />,
    },
});
