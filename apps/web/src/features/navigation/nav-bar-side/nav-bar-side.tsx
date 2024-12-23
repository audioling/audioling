import { NavBarPlaylistList } from '@/features/navigation/nav-bar-side/nav-bar-playlist-list.tsx';
import { NavItemList } from '@/features/navigation/nav-bar-side/nav-item-list.tsx';
import { SearchBar } from '@/features/navigation/nav-bar-side/search-bar.tsx';
import { useNavigationStore } from '@/features/navigation/stores/navigation-store.ts';
import { Accordion } from '@/features/ui/accordion/accordion.tsx';
import { ScrollArea } from '@/features/ui/scroll-area/scroll-area.tsx';
import styles from './nav-bar-side.module.scss';

export function NavBarSide() {
    const generalSections = useNavigationStore.use.side().general;
    const toggleSection = useNavigationStore.use.toggleSection();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <SearchBar />
            </div>
            <ScrollArea allowDragScroll>
                <Accordion.Group>
                    <Accordion
                        label="Library"
                        opened={generalSections['library']}
                        onOpenedChange={() => toggleSection('general')('library')}
                    >
                        <NavItemList />
                    </Accordion>
                    <Accordion
                        label="Playlists"
                        opened={generalSections['playlists']}
                        onOpenedChange={() => toggleSection('general')('playlists')}
                    >
                        <NavBarPlaylistList />
                    </Accordion>
                </Accordion.Group>
            </ScrollArea>
        </div>
    );
}
