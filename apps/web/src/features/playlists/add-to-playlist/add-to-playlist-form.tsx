import { useEffect, useMemo, useState } from 'react';
import {
    LibraryItemType,
    ListSortOrder,
    PlaylistListSortOptions,
    TrackListSortOptions,
} from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { TrackItem } from '@/api/api-types.ts';
import { fetchTracksByAlbumId } from '@/api/fetchers/albums.ts';
import { fetchTracksByAlbumArtistId } from '@/api/fetchers/artists.ts';
import {
    useGetApiLibraryIdPlaylistsIdTracksSuspense,
    usePostApiLibraryIdPlaylistsIdTracksAdd,
} from '@/api/openapi-generated/playlists/playlists.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { Group } from '@/features/ui/group/group.tsx';
import { ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import { Paper } from '@/features/ui/paper/paper.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { Switch } from '@/features/ui/switch/switch.tsx';
import { Text } from '@/features/ui/text/text.tsx';

interface AddToPlaylistFormProps {
    albums?: string[];
    artists?: string[];
    formId: string;
    libraryId: string;
    onSuccess: () => void;
    playlistId: string;
    setIsLoading: (isLoading: boolean) => void;
    tracks?: TrackItem[];
}

export function AddToPlaylistForm({
    albums,
    artists,
    formId,
    libraryId,
    playlistId,
    onSuccess,
    setIsLoading,
    tracks,
}: AddToPlaylistFormProps) {
    const queryClient = useQueryClient();
    const baseUrl = useAuthBaseUrl();

    const { data: playlistTracks } = useGetApiLibraryIdPlaylistsIdTracksSuspense(
        libraryId,
        playlistId,
        {
            sortBy: PlaylistListSortOptions.NAME,
            sortOrder: ListSortOrder.ASC,
        },
    );

    const { mutate: addToPlaylist, isPending } = usePostApiLibraryIdPlaylistsIdTracksAdd();

    const form = useForm({
        defaultValues: {
            skipDuplicates: true,
        },
    });

    useEffect(() => {
        setIsLoading(isPending);
    }, [isPending, setIsLoading]);

    const [tracksToAdd, setTracksToAdd] = useState<TrackItem[]>([]);

    useEffect(() => {
        const fetchTracks = async () => {
            const newTracks = [...(tracks ?? [])];

            for (const albumid of albums || []) {
                const tracks = await fetchTracksByAlbumId(queryClient, libraryId, albumid, {
                    sortBy: TrackListSortOptions.NAME,
                    sortOrder: ListSortOrder.ASC,
                });

                newTracks.push(...tracks.data);
            }

            for (const artistId of artists || []) {
                const tracks = await fetchTracksByAlbumArtistId(queryClient, libraryId, artistId, {
                    sortBy: TrackListSortOptions.NAME,
                    sortOrder: ListSortOrder.ASC,
                });

                newTracks.push(...tracks.data);
            }

            setTracksToAdd(newTracks);
        };

        fetchTracks();
    }, [albums, tracks, artists, libraryId, queryClient]);

    const skipDuplicates = form.watch('skipDuplicates');

    const processedTracks = useMemo(() => {
        return tracksToAdd.map((track) => {
            const isDuplicate = playlistTracks.data.some((t) => t.id === track.id);

            let name = track.name;

            if (isDuplicate && skipDuplicates) {
                name = `${name} __duplicate_skip__`;
            } else if (isDuplicate) {
                name = `${name} __duplicate__`;
            }

            return {
                ...track,
                name,
            };
        });
    }, [tracksToAdd, playlistTracks.data, skipDuplicates]);

    const handleSubmit = form.handleSubmit((data) => {
        if (!libraryId || !playlistId) {
            return;
        }

        const trackIds = processedTracks
            .filter((t) => !t.name.includes('__duplicate_skip__'))
            .map((t) => t.id);

        addToPlaylist(
            {
                data: {
                    skipDuplicates: data.skipDuplicates,
                    trackIds,
                },
                id: playlistId,
                libraryId,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: [`/api/${libraryId}/playlists`],
                    });

                    queryClient.invalidateQueries({
                        queryKey: [`/api/${libraryId}/playlists/${playlistId}/tracks`],
                    });

                    onSuccess();
                },
            },
        );
    });

    const columnOrder = [
        ItemListColumn.ROW_INDEX,
        ItemListColumn.IMAGE,
        ItemListColumn.ADD_TO_PLAYLIST,
    ];
    const { columns } = useItemTable<TrackItem>(columnOrder, () => {});

    const duplicateCount = processedTracks.filter((t) => t.name.includes('__duplicate')).length;
    const duplicateSkippedCount = processedTracks.filter((t) =>
        t.name.includes('__duplicate_skip__'),
    ).length;

    return (
        <form id={formId} onSubmit={handleSubmit}>
            <Stack>
                <Paper>
                    <Group grow align="center" justify="between">
                        <Stack gap="xs">
                            <Text isNoSelect>Skip duplicates</Text>
                            <Text isNoSelect isSecondary>
                                {duplicateSkippedCount} of {duplicateCount} duplicates skipped
                            </Text>
                        </Stack>

                        <Switch
                            // label="Skip duplicates"
                            value={form.watch('skipDuplicates')}
                            onChange={() =>
                                form.setValue('skipDuplicates', !form.watch('skipDuplicates'))
                            }
                        />
                    </Group>
                </Paper>
                <div style={{ height: '250px' }}>
                    <ItemTable
                        disableAutoScroll
                        columnOrder={columnOrder}
                        columns={columns}
                        context={{ baseUrl, libraryId }}
                        data={processedTracks}
                        enableHeader={false}
                        enableMultiRowSelection={false}
                        enableRowDrag={false}
                        enableRowSelection={false}
                        itemCount={processedTracks.length}
                        itemType={LibraryItemType.TRACK}
                        onChangeColumnOrder={() => {}}
                    />
                </div>
            </Stack>
        </form>
    );
}