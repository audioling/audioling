import { ListSortOrder, PlaylistListSortOptions } from '@repo/shared-types';
import { useParams } from 'react-router-dom';
import {
    useGetApiLibraryIdPlaylistsFoldersSuspense,
    useGetApiLibraryIdPlaylistsSuspense,
} from '@/api/openapi-generated/playlists/playlists.ts';
import { CreatePlaylistButton } from '@/features/navigation/nav-bar-side/create-playlist-button.tsx';
import { NavBarPlaylistTree } from '@/features/navigation/nav-bar-side/nav-bar-playlist-tree.tsx';
import { ScrollArea } from '@/features/ui/scroll-area/scroll-area.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';

export function NavBarPlaylistList() {
    const { libraryId } = useParams() as { libraryId: string };
    const { data: playlists } = useGetApiLibraryIdPlaylistsSuspense(libraryId, {
        sortBy: PlaylistListSortOptions.NAME,
        sortOrder: ListSortOrder.ASC,
    });

    const { data: folders } = useGetApiLibraryIdPlaylistsFoldersSuspense(libraryId, {
        sortBy: PlaylistListSortOptions.NAME,
        sortOrder: ListSortOrder.ASC,
    });

    return (
        <ScrollArea>
            <Stack gap="xs">
                <CreatePlaylistButton />

                <NavBarPlaylistTree
                    folders={folders.data}
                    libraryId={libraryId}
                    playlists={playlists.data}
                />
            </Stack>
        </ScrollArea>
    );
}
