import { useParams } from 'react-router';
import { CreatePlaylistModal } from '@/features/playlists/create-playlist/create-playlist-modal.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { Icon } from '@/features/ui/icon/icon.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './create-playlist-button.module.scss';

export function CreatePlaylistButton() {
    const { libraryId } = useParams() as { libraryId: string };

    return (
        <button className={styles.button} onClick={() => CreatePlaylistModal.call({ libraryId })}>
            <Group align="center" gap="md" justify="start" wrap="nowrap">
                <Icon icon="add" size="lg" />
                <Text size="md">Create New</Text>
            </Group>
        </button>
    );
}
