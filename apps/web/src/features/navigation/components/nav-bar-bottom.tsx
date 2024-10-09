import clsx from 'clsx';
import { motion } from 'framer-motion';
import { generatePath, NavLink, useLocation, useParams } from 'react-router-dom';
import { Icon } from '@/features/ui/icon/icon.tsx';
import { APP_ROUTE } from '@/routes/app-routes.ts';
import styles from './nav-bar-bottom.module.scss';

const tabs = [
    {
        href: 'home',
        icon: (
            <Icon
                icon="home"
                size={20}
            />
        ),
        label: 'Home',
    },
    {
        href: 'library',
        icon: (
            <Icon
                icon="library"
                size={20}
            />
        ),
        label: 'Library',
    },
    {
        href: 'search',
        icon: (
            <Icon
                icon="search"
                size={20}
            />
        ),
        label: 'Search',
    },
    {
        href: 'now-playing',
        icon: (
            <Icon
                icon="queue"
                size={20}
            />
        ),
        label: 'Playing',
    },
];

export const NavBarBottom = () => {
    const location = useLocation();
    const { libraryId } = useParams() as { libraryId: string };

    if (!libraryId) {
        return null;
    }

    return (
        <nav className={styles.navBarBottom}>
            {tabs.map((tab) => (
                <div
                    key={`bottom-nav-${tab.href}`}
                    className={styles.navBarItemContainer}
                >
                    <NavLink
                        className={clsx(styles.navBarItem, {
                            [styles.active]: location.pathname.includes(tab.href),
                        })}
                        to={
                            libraryId
                                ? generatePath(`/dashboard/:libraryId/${tab.href}`, { libraryId })
                                : APP_ROUTE.DASHBOARD_LIBRARY_SELECT
                        }
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </NavLink>
                    {location.pathname.includes(tab.href) && <ActiveTabHighlight />}
                </div>
            ))}
        </nav>
    );
};

function ActiveTabHighlight() {
    return (
        <motion.div
            className={styles.highlight}
            layoutId="active-tab"
        />
    );
}
