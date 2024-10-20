import { ListSortOrder, PlaylistListSortOptions } from '@repo/shared-types';
import { useParams } from 'react-router-dom';
import { useGetApiLibraryIdPlaylistsSuspense } from '@/api/openapi-generated/playlists/playlists.ts';
import { NavBarPlaylistItem } from '@/features/navigation/nav-bar-side/nav-bar-playlist-item.tsx';
import { ScrollArea } from '@/features/ui/scroll-area/scroll-area.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';

export function NavBarPlaylistList() {
    const { libraryId } = useParams() as { libraryId: string };
    const { data: playlists } = useGetApiLibraryIdPlaylistsSuspense(libraryId, {
        sortBy: PlaylistListSortOptions.NAME,
        sortOrder: ListSortOrder.ASC,
    });

    return (
        <>
            <ScrollArea>
                <Stack gap="xs">
                    {playlists.data.map((playlist) => (
                        <NavBarPlaylistItem
                            key={playlist.id}
                            libraryId={libraryId}
                            name={playlist.name}
                            playlistId={playlist.id}
                        />
                    ))}
                </Stack>
            </ScrollArea>
        </>
    );
}
