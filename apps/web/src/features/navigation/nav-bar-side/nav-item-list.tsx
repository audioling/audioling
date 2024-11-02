import { generatePath, useParams } from 'react-router-dom';
import { NavItem } from '@/features/navigation/nav-bar-side/nav-item.tsx';
import type { AppIcon } from '@/features/ui/icon/icon.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { APP_ROUTE } from '@/routes/app-routes.ts';

export function NavItemList() {
    const { libraryId } = useParams() as { libraryId: string };
    const navItems = getNavItems(libraryId);

    return (
        <Stack gap="xs">
            {navItems.map((item) => (
                <NavItem key={item.label} {...item} />
            ))}
        </Stack>
    );
}

function getNavItems(libraryId: string): {
    icon: keyof typeof AppIcon;
    label: string;
    to: string;
}[] {
    return [
        {
            icon: 'home',
            label: 'Home',
            to: generatePath(APP_ROUTE.DASHBOARD_HOME, { libraryId }),
        },
        {
            icon: 'album',
            label: 'Albums',
            to: generatePath(APP_ROUTE.DASHBOARD_ALBUMS, { libraryId }),
        },
        {
            icon: 'track',
            label: 'Tracks',
            to: generatePath(APP_ROUTE.DASHBOARD_TRACKS, { libraryId }),
        },
        {
            icon: 'genre',
            label: 'Genres',
            to: generatePath(APP_ROUTE.DASHBOARD_GENRES, { libraryId }),
        },
        {
            icon: 'playlist',
            label: 'Playlists',
            to: generatePath(APP_ROUTE.DASHBOARD_PLAYLISTS, { libraryId }),
        },
    ];
}
