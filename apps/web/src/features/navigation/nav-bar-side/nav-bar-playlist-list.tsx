import { Suspense } from 'react';
import { ListSortOrder, PlaylistListSortOptions } from '@repo/shared-types';
import { useParams } from 'react-router';
import {
    useGetApiLibraryIdPlaylistsFoldersSuspense,
    useGetApiLibraryIdPlaylistsSuspense,
} from '@/api/openapi-generated/playlists/playlists.ts';
import { CreatePlaylistButton } from '@/features/navigation/nav-bar-side/create-playlist-button.tsx';
import { NavBarPlaylistTree } from '@/features/navigation/nav-bar-side/nav-bar-playlist-tree.tsx';
import { EmptyPlaceholder } from '@/features/ui/placeholders/empty-placeholder.tsx';
import { ScrollArea } from '@/features/ui/scroll-area/scroll-area.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';

export function NavBarPlaylistList() {
    return (
        <ScrollArea>
            <Stack gap="xs">
                <CreatePlaylistButton />
                <Suspense fallback={<EmptyPlaceholder />}>
                    <PlaylistList />
                </Suspense>
            </Stack>
        </ScrollArea>
    );
}

function PlaylistList() {
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
        <NavBarPlaylistTree
            folders={folders.data}
            libraryId={libraryId}
            playlists={playlists.data}
        />
    );
}
