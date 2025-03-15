import type { TrackItem } from '/@/app-types';
import { TextInput } from '@mantine/core';
import { ListSortOrder, PlaylistListSortOptions } from '@repo/shared-types/app-types';
import { Suspense, useState } from 'react';
import { useParams } from 'react-router';
import { ContextMenu } from '/@/components/context-menu/context-menu';
import { Icon } from '/@/components/icon/icon';
import { Skeleton } from '/@/components/skeleton/skeleton';
import { useAppContext } from '/@/features/authentication/context/app-context';
import { usePlaylistList } from '/@/features/playlists/api/get-playlist-list';

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
                    stickyContent={(
                        <>
                            <TextInput
                                leftSection={<Icon icon="search" />}
                                size="sm"
                                value={search}
                                onBlur={() => setIsInputFocused(false)}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    setSearch(e.target.value);
                                }}
                                onFocus={() => setIsInputFocused(true)}
                                onKeyDown={e => e.stopPropagation()}
                            />
                            <ContextMenu.Item leftIcon="add">New playlist</ContextMenu.Item>
                            <ContextMenu.Divider />
                        </>
                    )}
                >
                    <Suspense
                        fallback={(
                            <ContextMenu.Item disabled>
                                <Skeleton />
                            </ContextMenu.Item>
                        )}
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
    albums,
    artists,
    genres,
    libraryId,
    playlists,
    search,
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
    const { server } = useAppContext();

    const { data: playlistList } = usePlaylistList(server, {
        query: {
            limit: -1,
            offset: 0,
            sortBy: PlaylistListSortOptions.NAME,
            sortOrder: ListSortOrder.ASC,
        },
    });

    const filteredPlaylists = playlistList.items.filter(playlist =>
        playlist.name.toLowerCase().includes(search.toLowerCase()),
    );

    if (filteredPlaylists.length === 0) {
        return <ContextMenu.Item disabled>No playlists found</ContextMenu.Item>;
    }

    const handleSelect = (playlistId: string) => {
        // AddToPlaylistModal.call({
        //     albums,
        //     artists,
        //     genres,
        //     libraryId,
        //     playlistId,
        //     playlists,
        //     tracks,
        // });
    };

    return (
        <>
            {filteredPlaylists.map(playlist => (
                <ContextMenu.Item key={playlist.id} onSelect={() => handleSelect(playlist.id)}>
                    {playlist.name}
                </ContextMenu.Item>
            ))}
        </>
    );
}
