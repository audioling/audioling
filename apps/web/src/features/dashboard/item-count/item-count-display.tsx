import { Suspense } from 'react';
import {
    AlbumListSortOptions,
    ArtistListSortOptions,
    GenreListSortOptions,
    ListSortOrder,
    TrackListSortOptions,
} from '@repo/shared-types';
import { generatePath } from 'react-router';
import { useGetApiLibraryIdAlbumArtistsCountSuspense } from '@/api/openapi-generated/album-artists/album-artists.ts';
import { useGetApiLibraryIdAlbumsCountSuspense } from '@/api/openapi-generated/albums/albums.ts';
import { useGetApiLibraryIdGenresCountSuspense } from '@/api/openapi-generated/genres/genres.ts';
import { useGetApiLibraryIdTracksCountSuspense } from '@/api/openapi-generated/tracks/tracks.ts';
import { ItemCountCard } from '@/features/dashboard/item-count/item-count-card.tsx';
import { APP_ROUTE } from '@/routes/app-routes.ts';
import styles from './item-count-display.module.scss';

export function ItemCountDisplay({ libraryId }: { libraryId: string }) {
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <AlbumArtistsCount libraryId={libraryId} />
                <AlbumsCount libraryId={libraryId} />
                <TracksCount libraryId={libraryId} />
                <GenresCount libraryId={libraryId} />
            </div>
        </div>
    );
}

function CardWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<ItemCountCard isLoading count={0} label="" to="/" />}>
            {children}
        </Suspense>
    );
}

function AlbumsCount({ libraryId }: { libraryId: string }) {
    const { data: albumsCount } = useGetApiLibraryIdAlbumsCountSuspense(libraryId, {
        sortBy: AlbumListSortOptions.NAME,
        sortOrder: ListSortOrder.ASC,
    });

    return (
        <CardWrapper>
            <ItemCountCard
                count={albumsCount}
                label="Albums"
                to={generatePath(APP_ROUTE.DASHBOARD_ALBUMS, { libraryId })}
            />
        </CardWrapper>
    );
}

function AlbumArtistsCount({ libraryId }: { libraryId: string }) {
    const { data: artistsCount } = useGetApiLibraryIdAlbumArtistsCountSuspense(libraryId, {
        sortBy: ArtistListSortOptions.NAME,
        sortOrder: ListSortOrder.ASC,
    });

    return (
        <CardWrapper>
            <ItemCountCard
                count={artistsCount}
                label="Artists"
                to={generatePath(APP_ROUTE.DASHBOARD_ARTISTS, { libraryId })}
            />
        </CardWrapper>
    );
}

function TracksCount({ libraryId }: { libraryId: string }) {
    const { data: tracksCount } = useGetApiLibraryIdTracksCountSuspense(libraryId, {
        sortBy: TrackListSortOptions.NAME,
        sortOrder: ListSortOrder.ASC,
    });

    return (
        <CardWrapper>
            <ItemCountCard
                count={tracksCount}
                label="Tracks"
                to={generatePath(APP_ROUTE.DASHBOARD_TRACKS, { libraryId })}
            />
        </CardWrapper>
    );
}

function GenresCount({ libraryId }: { libraryId: string }) {
    const { data: genresCount } = useGetApiLibraryIdGenresCountSuspense(libraryId, {
        sortBy: GenreListSortOptions.NAME,
        sortOrder: ListSortOrder.ASC,
    });

    return (
        <CardWrapper>
            <ItemCountCard
                count={genresCount}
                label="Genres"
                to={generatePath(APP_ROUTE.DASHBOARD_GENRES, { libraryId })}
            />
        </CardWrapper>
    );
}
