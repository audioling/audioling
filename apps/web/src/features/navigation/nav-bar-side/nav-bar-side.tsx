import { NavBarPlaylistList } from '@/features/navigation/nav-bar-side/nav-bar-playlist-list.tsx';
import { NavItemList } from '@/features/navigation/nav-bar-side/nav-item-list.tsx';
import { SearchBar } from '@/features/navigation/nav-bar-side/search-bar.tsx';
import {
    useGeneralNavigationSections,
    useToggleGeneralSection,
} from '@/features/navigation/stores/navigation-store.ts';
import { Accordion } from '@/features/ui/accordion/accordion.tsx';
import { ScrollArea } from '@/features/ui/scroll-area/scroll-area.tsx';
import styles from './nav-bar-side.module.scss';

export function NavBarSide() {
    const generalSections = useGeneralNavigationSections();
    const toggleGeneralSection = useToggleGeneralSection();

    return (
        <div className={styles.container}>
            <SearchBar />
            <ScrollArea allowDragScroll>
                <Accordion.Group>
                    <Accordion
                        label="Library"
                        opened={generalSections['library']}
                        onOpenedChange={() => toggleGeneralSection('library')}
                    >
                        <NavItemList />
                    </Accordion>
                    <Accordion
                        label="Playlists"
                        opened={generalSections['playlists']}
                        onOpenedChange={() => toggleGeneralSection('playlists')}
                    >
                        <NavBarPlaylistList />
                    </Accordion>
                </Accordion.Group>
            </ScrollArea>
        </div>
    );
}
