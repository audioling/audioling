import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import type { PlaylistItem } from '@/api/api-types.ts';
import { useGetApiLibraryIdPlaylistsIdSuspense } from '@/api/openapi-generated/playlists/playlists.ts';
import { PlaylistDetailHeader } from '@/features/playlists/detail/playlist-detail-header.tsx';
import { ReadOnlyPlaylistTrackTable } from '@/features/playlists/detail/read-only-playlist-track-table.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import { PageContainer } from '@/features/shared/page-container/page-container.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';

export function PlaylistDetailRoute() {
    const { libraryId, playlistId } = useParams() as { libraryId: string; playlistId: string };

    const queryClient = useQueryClient();

    const initialData = {
        data: queryClient.getQueryData<Record<string, PlaylistItem>>(
            itemListHelpers.getDataQueryKey(libraryId, LibraryItemType.PLAYLIST),
        )?.[playlistId as string] as PlaylistItem,
        meta: {},
    };

    const { data } = useGetApiLibraryIdPlaylistsIdSuspense(libraryId, playlistId, {
        query: {
            initialData: initialData.data ? initialData : undefined,
        },
    });

    const listKey = `playlist-detail-${data.data.id}-${data.data.trackCount}`;

    return (
        <PageContainer>
            <PlaylistDetailContent listKey={listKey} playlist={data.data} />
        </PageContainer>
    );
}

function PlaylistDetailContent({ playlist, listKey }: { listKey: string; playlist: PlaylistItem }) {
    return (
        <PlaylistDetailTable libraryId={playlist.libraryId} listKey={listKey} playlist={playlist} />
    );
}

function PlaylistDetailTable({
    listKey,
    libraryId,
    playlist,
}: {
    libraryId: string;
    listKey: string;
    playlist: PlaylistItem;
}) {
    return (
        <ListWrapper listKey={listKey}>
            <ReadOnlyPlaylistTrackTable
                HeaderComponent={() => <PlaylistDetailHeader playlist={playlist} />}
                itemCount={playlist.trackCount ?? 0}
                libraryId={libraryId}
                listKey={listKey}
                pagination={{ currentPage: 0, itemsPerPage: 500 }}
                params={{ sortBy: TrackListSortOptions.ID, sortOrder: ListSortOrder.DESC }}
                playlistId={playlist.id}
            />
        </ListWrapper>
    );
}
