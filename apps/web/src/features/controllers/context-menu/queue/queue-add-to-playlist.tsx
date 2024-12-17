import { Suspense } from 'react';
import { ListSortOrder, PlaylistListSortOptions } from '@repo/shared-types';
import { useParams } from 'react-router';
import { useGetApiLibraryIdPlaylistsSuspense } from '@/api/openapi-generated/playlists/playlists.ts';
import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

export function QueueAddToPlaylist() {
    const { libraryId } = useParams() as { libraryId: string };

    return (
        <>
            <ContextMenu.Submenu disabled>
                <ContextMenu.SubmenuTarget>
                    <ContextMenu.Item leftIcon="playlistAdd" rightIcon="arrowRightS">
                        Add to playlist
                    </ContextMenu.Item>
                </ContextMenu.SubmenuTarget>
                <ContextMenu.SubmenuContent>
                    <Suspense fallback={<ContextMenu.Item disabled>Loading...</ContextMenu.Item>}>
                        <PlaylistItems libraryId={libraryId} />
                    </Suspense>
                </ContextMenu.SubmenuContent>
            </ContextMenu.Submenu>
        </>
    );
}

function PlaylistItems({ libraryId }: { libraryId: string }) {
    const { data: playlists } = useGetApiLibraryIdPlaylistsSuspense(libraryId, {
        sortBy: PlaylistListSortOptions.NAME,
        sortOrder: ListSortOrder.ASC,
    });

    return (
        <>
            {playlists.data.map((playlist) => (
                <ContextMenu.Item key={playlist.id}>{playlist.name}</ContextMenu.Item>
            ))}
        </>
    );
}
