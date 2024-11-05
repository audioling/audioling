import { Suspense } from 'react';
import { AlbumListContent } from '@/features/albums/list/album-list-content.tsx';
import { AlbumListHeader } from '@/features/albums/list/album-list-header.tsx';
import { useAlbumListActions } from '@/features/albums/stores/album-list-store.ts';
import { AnimatedPage } from '@/features/shared/animated-page/animated-page.tsx';
import { ComponentErrorBoundary } from '@/features/shared/error-boundary/component-error-boundary.tsx';
import { EmptyPlaceholder } from '@/features/ui/placeholders/empty-placeholder.tsx';
import { useListInitialize } from '@/hooks/use-list.ts';

export function AlbumListRoute() {
    const { setListId } = useAlbumListActions();
    useListInitialize({ setListId });

    return (
        <AnimatedPage>
            <AlbumListHeader />
            <Suspense fallback={<EmptyPlaceholder />}>
                <ComponentErrorBoundary>
                    <AlbumListContent />
                </ComponentErrorBoundary>
            </Suspense>
        </AnimatedPage>
    );
}
