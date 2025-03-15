import { NavLink } from '@mantine/core';
import styles from './nav-link.module.css';

export const NavLinkComponentOverride = NavLink.extend({
    classNames: {
        label: styles.label,
        root: styles.root,
    },
});
