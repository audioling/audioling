import { generatePath, NavLink } from 'react-router-dom';
import { Text } from '@/features/ui/text/text.tsx';
import { APP_ROUTE } from '@/routes/app-routes.ts';
import styles from './nav-bar-playlist-item.module.scss';

interface NavBarPlaylistItemProps {
    libraryId: string;
    name: string;
    playlistId: string;
}

export function NavBarPlaylistItem(props: NavBarPlaylistItemProps) {
    const { libraryId, name, playlistId } = props;

    return (
        <NavLink
            className={styles.container}
            to={generatePath(APP_ROUTE.DASHBOARD_PLAYLISTS_DETAIL, {
                libraryId: libraryId,
                playlistId: playlistId,
            })}
        >
            <Text size="md">{name}</Text>
        </NavLink>
    );
}
