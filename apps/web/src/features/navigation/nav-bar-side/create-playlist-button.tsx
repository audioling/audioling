import { useParams } from 'react-router-dom';
import { CreatePlaylistModal } from '@/features/playlists/create-playlist/create-playlist-modal.tsx';
import { CreatePlaylistFolderModal } from '@/features/playlists/create-playlist-folder/create-playlist-folder-modal.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { Icon } from '@/features/ui/icon/icon.tsx';
import { Menu } from '@/features/ui/menu/menu.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './create-playlist-button.module.scss';

export function CreatePlaylistButton() {
    const { libraryId } = useParams() as { libraryId: string };

    return (
        <Menu align="end" side="bottom">
            <Menu.Target>
                <button className={styles.button}>
                    <Group align="center" gap="md" justify="start" wrap="nowrap">
                        <Icon icon="add" size="lg" />
                        <Text size="md">Create New</Text>
                    </Group>
                </button>
            </Menu.Target>
            <Menu.Content>
                <Menu.Item onSelect={() => CreatePlaylistModal.call({ libraryId })}>
                    Create Playlist
                </Menu.Item>
                <Menu.Item onSelect={() => CreatePlaylistFolderModal.call({ libraryId })}>
                    Create Folder
                </Menu.Item>
            </Menu.Content>
        </Menu>
    );
}
