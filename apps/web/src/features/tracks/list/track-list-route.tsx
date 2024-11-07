import { Suspense } from 'react';
import { AnimatedContainer } from '@/features/shared/animated-container/animated-container.tsx';
import { ComponentErrorBoundary } from '@/features/shared/error-boundary/component-error-boundary.tsx';
import { PageContainer } from '@/features/shared/page-container/page-container.tsx';
import { TrackListContent } from '@/features/tracks/list/track-list-content.tsx';
import { TrackListHeader } from '@/features/tracks/list/track-list-header.tsx';
import { useTrackListActions } from '@/features/tracks/store/track-list-store.ts';
import { EmptyPlaceholder } from '@/features/ui/placeholders/empty-placeholder.tsx';
import { useDelayedRender } from '@/hooks/use-delayed-render.ts';
import { useListInitialize } from '@/hooks/use-list.ts';

export function TrackListRoute() {
    const { setListId } = useTrackListActions();
    useListInitialize({ setListId });

    const { show } = useDelayedRender(300);

    return (
        <PageContainer id="track-list-route">
            <TrackListHeader />
            {show && (
                <AnimatedContainer>
                    <Suspense fallback={<EmptyPlaceholder />}>
                        <ComponentErrorBoundary>
                            <TrackListContent />
                        </ComponentErrorBoundary>
                    </Suspense>
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
