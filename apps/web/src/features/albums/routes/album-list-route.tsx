import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { ListContext, useInitializeListContext } from '../../shared/context/list-context';
import { FullPageLoader } from '/@/components/loader/loader';
import { useAlbumListCount } from '/@/features/albums/api/get-album-list-count';
import { AlbumListConfigMenu, AlbumListFilters } from '/@/features/albums/components/album-list-filters';
import { InfiniteServerAlbumGrid } from '/@/features/albums/components/infinite-server-album-grid';
import { InfiniteServerAlbumTable } from '/@/features/albums/components/infinite-server-album-table';
import { PaginatedServerAlbumGrid } from '/@/features/albums/components/paginated-server-album-grid';
import { useAlbumListOptions, useAlbumListParams } from '/@/features/albums/hooks/use-album-list-options';
import { useAppContext } from '/@/features/authentication/context/app-context';
import { ListContainer } from '/@/features/shared/components/item-list/container/list-container';
import { ItemListDisplayType, ItemListPaginationType } from '/@/features/shared/components/item-list/types';
import { PageContainer } from '/@/features/shared/components/page-container/page-container';

export function AlbumListRoute() {
    const listContext = useInitializeListContext();

    return (
        <PageContainer>
            <ListContext.Provider value={listContext}>
                <ListContainer>
                    <ListContainer.Header>
                        <Header />
                    </ListContainer.Header>
                    <ListContainer.Content>
                        <Suspense fallback={<FullPageLoader />}>
                            <Content />
                        </Suspense>
                    </ListContainer.Content>
                </ListContainer>
            </ListContext.Provider>
        </PageContainer>
    );
}

function Header() {
    const { t } = useTranslation();

    return (
        <>
            <ListContainer.Left>
                <ListContainer.Title>{t('app.albums.title')}</ListContainer.Title>
                <Suspense fallback={<ListContainer.ItemCount loading value={0} />}>
                    <HeaderItemCount />
                </Suspense>
            </ListContainer.Left>
            <ListContainer.Right>
                &nbsp;
            </ListContainer.Right>
            <ListContainer.Block>
                <AlbumListFilters />
                <AlbumListConfigMenu />
            </ListContainer.Block>
        </>
    );
}

function HeaderItemCount() {
    const { server } = useAppContext();
    const { params } = useAlbumListParams();
    const { data: itemCount } = useAlbumListCount(server, { query: params });

    return <ListContainer.ItemCount value={itemCount || 0} />;
}

function Content() {
    const { server } = useAppContext();
    const { displayType, pagination, paginationType } = useAlbumListOptions();
    const { componentKey, params } = useAlbumListParams();

    switch (displayType) {
        case ItemListDisplayType.TABLE:
            return (
                <InfiniteServerAlbumTable
                    key={componentKey}
                    itemSelectionType="multiple"
                    pagination={pagination}
                    params={params}
                    server={server}
                />
            );
        case ItemListDisplayType.GRID:
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
        default:
            return null;
    }
}
