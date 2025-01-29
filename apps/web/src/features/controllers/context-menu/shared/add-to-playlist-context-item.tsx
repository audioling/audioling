import { Suspense, useState } from 'react';
import { ListSortOrder, PlaylistListSortOptions } from '@repo/shared-types';
import { useParams } from 'react-router';
import type { TrackItem } from '@/api/api-types.ts';
import { useGetApiLibraryIdPlaylistsSuspense } from '@/api/openapi-generated/playlists/playlists.ts';
import { AddToPlaylistModal } from '@/features/playlists/add-to-playlist/add-to-playlist-modal.tsx';
import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';

interface AddToPlaylistContextItemProps {
    albums?: string[];
    artists?: string[];
    genres?: string[];
    playlists?: string[];
    tracks?: TrackItem[];
}

export function AddToPlaylistContextItem(props: AddToPlaylistContextItemProps) {
    const { libraryId } = useParams() as { libraryId: string };

    const [search, setSearch] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);

    return (
        <>
            <ContextMenu.Submenu isCloseDisabled={isInputFocused}>
                <ContextMenu.SubmenuTarget>
                    <ContextMenu.Item leftIcon="playlistAdd" rightIcon="arrowRightS">
                        Add to playlist
                    </ContextMenu.Item>
                </ContextMenu.SubmenuTarget>
                <ContextMenu.SubmenuContent
                    stickyContent={
                        <>
                            <TextInput
                                leftIcon="search"
                                size="sm"
                                value={search}
                                onBlur={() => setIsInputFocused(false)}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    setSearch(e.target.value);
                                }}
                                onFocus={() => setIsInputFocused(true)}
                                onKeyDown={(e) => e.stopPropagation()}
                            />
                            <ContextMenu.Item leftIcon="add">New playlist</ContextMenu.Item>
                            <ContextMenu.Divider />
                        </>
                    }
                >
                    <Suspense
                        fallback={
                            <ContextMenu.Item disabled>
                                <Skeleton />
                            </ContextMenu.Item>
                        }
                    >
                        <ContextMenuPlaylistItems
                            libraryId={libraryId}
                            search={search}
                            {...props}
                        />
                    </Suspense>
                </ContextMenu.SubmenuContent>
            </ContextMenu.Submenu>
        </>
    );
}

export function ContextMenuPlaylistItems({
    libraryId,
    search,
    albums,
    artists,
    genres,
    playlists,
    tracks,
}: {
    albums?: string[];
    artists?: string[];
    genres?: string[];
    libraryId: string;
    playlists?: string[];
    search: string;
    tracks?: TrackItem[];
}) {
    const { data: playlistList } = useGetApiLibraryIdPlaylistsSuspense(libraryId, {
        sortBy: PlaylistListSortOptions.NAME,
        sortOrder: ListSortOrder.ASC,
    });

    const filteredPlaylists = playlistList.data.filter((playlist) =>
        playlist.name.toLowerCase().includes(search.toLowerCase()),
    );

    if (filteredPlaylists.length === 0) {
        return <ContextMenu.Item disabled>No playlists found</ContextMenu.Item>;
    }

    const handleSelect = (playlistId: string) => {
        AddToPlaylistModal.call({
            albums,
            artists,
            genres,
            libraryId,
            playlistId,
            playlists,
            tracks,
        });
    };

    return (
        <>
            {filteredPlaylists.map((playlist) => (
                <ContextMenu.Item key={playlist.id} onSelect={() => handleSelect(playlist.id)}>
                    {playlist.name}
                </ContextMenu.Item>
            ))}
        </>
    );
}
