import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { ListContext, useInitializeListContext } from '../../shared/context/list-context';
import { FullPageLoader } from '/@/components/loader/loader';
import { useAlbumListCount } from '/@/features/albums/api/get-album-list-count';
import { AlbumListFilters } from '/@/features/albums/components/album-list-filters';
import { InfiniteServerAlbumGrid } from '/@/features/albums/components/infinite-server-album-grid';
import { PaginatedServerAlbumGrid } from '/@/features/albums/components/paginated-server-album-grid';
import { useAlbumListOptions, useAlbumListParams } from '/@/features/albums/hooks/use-album-list-options';
import { useAppContext } from '/@/features/authentication/context/app-context';
import { ItemList } from '/@/features/shared/components/item-list/base/item-list';
import { ItemListPaginationType } from '/@/features/shared/components/item-list/types';
import { PageContainer } from '/@/features/shared/components/page-container/page-container';

export function AlbumListRoute() {
    const listContext = useInitializeListContext();

    return (
        <PageContainer>
            <ListContext.Provider value={listContext}>
                <ItemList>
                    <ItemList.Header.Root>
                        <Header />
                    </ItemList.Header.Root>
                    <ItemList.Content>
                        <Suspense fallback={<FullPageLoader />}>
                            <Content />
                        </Suspense>
                    </ItemList.Content>
                </ItemList>
            </ListContext.Provider>
        </PageContainer>
    );
}

function Header() {
    const { t } = useTranslation();

    return (
        <>
            <ItemList.Header.Left>
                <ItemList.Header.Title>{t('app.albums.title')}</ItemList.Header.Title>
                <Suspense fallback={<ItemList.Header.ItemCount loading value={0} />}>
                    <HeaderItemCount />
                </Suspense>
            </ItemList.Header.Left>
            <ItemList.Header.Footer>
                <ItemList.Header.Left>
                    <AlbumListFilters />
                </ItemList.Header.Left>
            </ItemList.Header.Footer>
        </>
    );
}

function HeaderItemCount() {
    const { server } = useAppContext();
    const { params } = useAlbumListParams();
    const { data: itemCount } = useAlbumListCount(server, { query: params });

    return <ItemList.Header.ItemCount value={itemCount || 0} />;
}

function Content() {
    const { server } = useAppContext();
    const { pagination, paginationType } = useAlbumListOptions();
    const { componentKey, params } = useAlbumListParams();

    switch (paginationType) {
        case ItemListPaginationType.INFINITE:
            return (
                <InfiniteServerAlbumGrid
                    key={componentKey}
                    itemSelectionType="multiple"
                    pagination={pagination}
                    params={params}
                    server={server}
                />
            );
        case ItemListPaginationType.PAGINATED:
            return (
                <PaginatedServerAlbumGrid
                    key={componentKey}
                    itemSelectionType="multiple"
                    pagination={pagination}
                    params={params}
                    server={server}
                />
            );
        default:
            return null;
    }
}
