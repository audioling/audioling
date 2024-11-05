import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useGetApiLibraryIdAlbumsCountSuspense } from '@/api/openapi-generated/albums/albums.ts';
import { AlbumListHeader } from '@/features/albums/list/album-list-header.tsx';
import { InfiniteAlbumGrid } from '@/features/albums/list/infinite-album-grid.tsx';
import { InfiniteAlbumTable } from '@/features/albums/list/infinite-album-table.tsx';
import {
    useAlbumListActions,
    useAlbumListState,
} from '@/features/albums/stores/album-list-store.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { AnimatedPage } from '@/features/shared/animated-page/animated-page.tsx';
import { ComponentErrorBoundary } from '@/features/shared/error-boundary/component-error-boundary.tsx';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { ItemListDisplayType } from '@/features/ui/item-list/types.ts';
import { useListInitialize, useListKey } from '@/hooks/use-list.ts';

export function AlbumListRoute() {
    const { setListId } = useAlbumListActions();
    useListInitialize({ setListId });

    return (
        <AnimatedPage>
            <AlbumListHeader />
            <Suspense fallback={<></>}>
                <ComponentErrorBoundary>
                    <ListContent />
                </ComponentErrorBoundary>
            </Suspense>
        </AnimatedPage>
    );
}

function ListContent() {
    const { libraryId } = useParams() as { libraryId: string };
    const { sortBy, sortOrder, displayType, listId } = useAlbumListState();
    const baseUrl = useAuthBaseUrl();

    const { data: itemCount } = useGetApiLibraryIdAlbumsCountSuspense(libraryId, {
        sortBy,
        sortOrder,
    });

    const listKey = useListKey({ displayType, listId, sortBy, sortOrder });

    return (
        <motion.div
            key={listKey}
            animate="show"
            id="album-list-content"
            initial="hidden"
            style={{ height: '100%', width: '100%' }}
            transition={{ duration: 0.5 }}
            variants={animationVariants.fadeIn}
        >
            {displayType === ItemListDisplayType.GRID ? (
                <InfiniteAlbumGrid
                    baseUrl={baseUrl || ''}
                    itemCount={itemCount}
                    libraryId={libraryId}
                    params={{ sortBy, sortOrder }}
                />
            ) : (
                <InfiniteAlbumTable
                    baseUrl={baseUrl || ''}
                    itemCount={itemCount}
                    libraryId={libraryId}
                    params={{ sortBy, sortOrder }}
                />
            )}
        </motion.div>
    );
}
