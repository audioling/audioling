import type { AppIconSelection } from '/@/components/icon/icon';
import { NavLink } from '@mantine/core';
import { localize } from '@repo/localization';
import { useMemo } from 'react';
import { generatePath, NavLink as RNavLink, useLocation } from 'react-router';
import styles from './left-sidebar.module.css';
import { Icon } from '/@/components/icon/icon';
import { useAppContext } from '/@/features/authentication/context/app-context';
import { AppRoute } from '/@/routes/types';
import { LeftSidebarGroup, LibraryGroupItem, useSettingsStore } from '/@/stores/settings-store';

const libraryItems: Record<LibraryGroupItem, {
    icon: AppIconSelection;
    label: string;
    route: (typeof AppRoute)[keyof typeof AppRoute];
}> = {
    [LibraryGroupItem.HOME]: {
        icon: 'home',
        label: localize.t('navigation.home'),
        route: AppRoute.APP_HOME,
    },
    [LibraryGroupItem.ALBUMS]: {
        icon: 'album',
        label: localize.t('app.albums.title'),
        route: AppRoute.APP_ALBUMS,
    },
    [LibraryGroupItem.TRACKS]: {
        icon: 'track',
        label: localize.t('app.tracks.title'),
        route: AppRoute.APP_TRACKS,
    },
    [LibraryGroupItem.ALBUM_ARTISTS]: {
        icon: 'artist',
        label: localize.t('app.albumArtists.title'),
        route: AppRoute.APP_ALBUM_ARTISTS,
    },
    [LibraryGroupItem.ARTISTS]: {
        icon: 'artist',
        label: localize.t('app.artists.title'),
        route: AppRoute.APP_ARTISTS,
    },
    [LibraryGroupItem.FOLDERS]: {
        icon: 'folder',
        label: localize.t('app.folders.title'),
        route: AppRoute.APP_FOLDERS,
    },
    [LibraryGroupItem.GENRES]: {
        icon: 'genre',
        label: localize.t('app.genres.title'),
        route: AppRoute.APP_GENRES,
    },
    [LibraryGroupItem.PLAYLISTS]: {
        icon: 'playlist',
        label: localize.t('app.playlists.title'),
        route: AppRoute.APP_PLAYLISTS,
    },
};

export function LibraryGroup() {
    const { server } = useAppContext();
    const location = useLocation();
    const itemOrder = useSettingsStore.use.layout().left.items[LeftSidebarGroup.LIBRARY];

    const items = useMemo(() => {
        return itemOrder.map(item => libraryItems[item]);
    }, [itemOrder]);

    return (
        <>
            {items.map(item => (
                <NavLink
                    key={item.label}
                    active={location.pathname === generatePath(item.route, { serverId: server.id })}
                    classNames={{
                        section: styles.linkSection,
                    }}
                    component={RNavLink}
                    label={item.label}
                    leftSection={item.icon ? <Icon icon={item.icon} /> : null}
                    to={generatePath(item.route, { serverId: server.id })}
                />
            ))}
        </>
    );
}
