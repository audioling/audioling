import { Accordion, Group, Text } from '@mantine/core';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './left-sidebar.module.css';
import { PlaylistGroup } from './playlist-group';
import { ScrollArea } from '/@/components/scroll-area/scroll-area';
import { GlobalSearchBar } from '/@/features/app/components/left-sidebar/global-search-bar';
import { LibraryGroup } from '/@/features/app/components/left-sidebar/library-group';
import { LeftSidebarGroup, useLeftSidebarExpanded, useSettingsStore } from '/@/stores/settings-store';

export function LeftSidebar() {
    const { t } = useTranslation();
    const expanded = useLeftSidebarExpanded();
    const setSettings = useSettingsStore.use.setState();

    const handleChange = useCallback((value: string[]) => {
        setSettings(['layout', 'left', 'expanded'], value);
    }, [setSettings]);

    return (
        <div className={styles.container} id="left-sidebar">
            <Group grow id="global-search-container">
                <GlobalSearchBar />
            </Group>
            <ScrollArea allowDragScroll>
                <Accordion multiple value={expanded} onChange={handleChange}>
                    <Accordion.Item value={LeftSidebarGroup.LIBRARY}>
                        <Accordion.Control>
                            <Text fw={600} variant="secondary">{t('navigation.library')}</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <LibraryGroup />
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value={LeftSidebarGroup.PLAYLISTS}>
                        <Accordion.Control>
                            <Text fw={600} variant="secondary">{t('navigation.playlists')}</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <PlaylistGroup />
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </ScrollArea>
        </div>
    );
}
