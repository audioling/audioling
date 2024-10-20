import { NavBarPlaylistList } from '@/features/navigation/nav-bar-side/nav-bar-playlist-list.tsx';
import { NavItemList } from '@/features/navigation/nav-bar-side/nav-item-list.tsx';
import { SearchBar } from '@/features/navigation/nav-bar-side/search-bar.tsx';
import { Divider } from '@/features/ui/divider/divider.tsx';
import styles from './nav-bar-side.module.scss';

export function NavBarSide() {
    return (
        <div className={styles.container}>
            <div className={styles.searchBar}>
                <SearchBar />
            </div>
            <Divider />
            <div className={styles.navItems}>
                <NavItemList />
            </div>
            <Divider />
            <div className={styles.playlistList}>
                <NavBarPlaylistList />
            </div>
        </div>
    );
}
