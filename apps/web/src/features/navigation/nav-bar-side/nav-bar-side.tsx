import { NavBarPlaylistList } from '@/features/navigation/nav-bar-side/nav-bar-playlist-list.tsx';
import { NavItemList } from '@/features/navigation/nav-bar-side/nav-item-list.tsx';
import { SearchBar } from '@/features/navigation/nav-bar-side/search-bar.tsx';
import { Accordion } from '@/features/ui/accordion/accordion.tsx';
import { ScrollArea } from '@/features/ui/scroll-area/scroll-area.tsx';
import styles from './nav-bar-side.module.scss';

export function NavBarSide() {
    return (
        <div className={styles.container}>
            <SearchBar />
            <ScrollArea>
                <Accordion.Group>
                    <Accordion label="Library">
                        <div className={styles.navItems}>
                            <NavItemList />
                        </div>
                    </Accordion>
                    <Accordion label="Playlists">
                        <div className={styles.playlistList}>
                            <NavBarPlaylistList />
                        </div>
                    </Accordion>
                </Accordion.Group>
            </ScrollArea>
        </div>
    );
}
