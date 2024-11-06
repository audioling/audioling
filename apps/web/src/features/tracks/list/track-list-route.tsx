import { ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import { useParams } from 'react-router-dom';
import { useGetApiLibraryIdTracksCountSuspense } from '@/api/openapi-generated/tracks/tracks.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { AnimatedContainer } from '@/features/shared/animated-container/animated-container.tsx';
import { PageContainer } from '@/features/shared/page-container/page-container.tsx';
import { InfiniteTrackTable } from '@/features/tracks/list/infinite-track-table.tsx';
import { TrackListHeader } from '@/features/tracks/list/track-list-header.tsx';
import { useDelayedRender } from '@/hooks/use-delayed-render.ts';

export function TrackListRoute() {
    const { libraryId } = useParams() as { libraryId: string };
    const baseUrl = useAuthBaseUrl();

    const { data: itemCount } = useGetApiLibraryIdTracksCountSuspense(libraryId, {
        sortBy: TrackListSortOptions.NAME,
        sortOrder: ListSortOrder.ASC,
    });

    const { show } = useDelayedRender(300);

    return (
        <PageContainer id="track-list-route">
            <TrackListHeader />
            {show && (
                <AnimatedContainer>
                    <InfiniteTrackTable
                        baseUrl={baseUrl || ''}
                        itemCount={itemCount}
                        libraryId={libraryId}
                        params={{ sortBy: TrackListSortOptions.NAME, sortOrder: ListSortOrder.ASC }}
                    />
                </AnimatedContainer>
            )}
        </PageContainer>
    );
}

// const trackListCountQuery = (libraryId: string) => ({
//     queryFn: () =>
//         getApiLibraryIdTracksCount(libraryId, {
//             sortBy: TrackListSortOptions.NAME,
//             sortOrder: ListSortOrder.ASC,
//         }),
//     queryKey: getGetApiLibraryIdTracksCountQueryKey(libraryId, {
//         sortBy: TrackListSortOptions.NAME,
//         sortOrder: ListSortOrder.ASC,
//     }),
// });

// export function trackListLoader(queryClient: QueryClient) {
//     return async ({ params }: { params: { libraryId: string } }) => {
//         const query = trackListCountQuery(params.libraryId);
//         return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));
//     };
// }
