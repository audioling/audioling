import type { LibraryFeatures } from '@repo/shared-types';
import { AlbumListSortOptions } from '@repo/shared-types';
import { useParams } from 'react-router-dom';
import { useLibraryFeatures } from '@/features/authentication/stores/auth-store.ts';
import { ListHeader } from '@/features/shared/components/list-header.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton, IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';
import { Menu } from '@/features/ui/menu/menu.tsx';

export function AlbumListHeader() {
    return (
        <ListHeader>
            <ListHeader.Left>
                <ListHeader.Title>Albums</ListHeader.Title>
            </ListHeader.Left>
            <ListHeader.Right>
                <Group gap="xs">
                    <IconButton icon="search" size="lg" />
                </Group>
            </ListHeader.Right>
            <ListHeader.Footer>
                <ListHeader.Left>
                    <Group gap="xs" wrap="nowrap">
                        <AlbumListFilter />
                        <IconButtonWithTooltip
                            icon="sortAsc"
                            size="lg"
                            tooltipProps={{ label: 'Sort order', position: 'bottom' }}
                        />
                        <IconButtonWithTooltip
                            icon="refresh"
                            size="lg"
                            tooltipProps={{ label: 'Refresh', position: 'bottom' }}
                        />
                    </Group>
                </ListHeader.Left>
                <ListHeader.Right>
                    <Group gap="xs" wrap="nowrap">
                        <IconButtonWithTooltip
                            icon="layoutGrid"
                            size="lg"
                            tooltipProps={{ label: 'Grid', position: 'bottom' }}
                        />
                        <IconButtonWithTooltip
                            icon="listInfinite"
                            size="lg"
                            tooltipProps={{ label: 'Infinite', position: 'bottom' }}
                        />
                    </Group>
                </ListHeader.Right>
            </ListHeader.Footer>
        </ListHeader>
    );
}

function AlbumListFilter() {
    const { libraryId } = useParams() as { libraryId: string };
    const features = useLibraryFeatures(libraryId);
    const sortOptions = getSortOptions(features);

    return (
        <Menu align="start" side="bottom">
            <Menu.Target>
                <IconButtonWithTooltip
                    icon="sort"
                    size="lg"
                    tooltipProps={{ label: 'Sort by', position: 'bottom' }}
                />
            </Menu.Target>
            <Menu.Content>
                {sortOptions.map((option) => (
                    <Menu.Item key={`sort-${option.value}`}>{option.name}</Menu.Item>
                ))}
            </Menu.Content>
        </Menu>
    );
}

const albumSortLabelMap = {
    [AlbumListSortOptions.ALBUM_ARTIST]: 'Album Artist',
    [AlbumListSortOptions.ARTIST]: 'Artist',
    [AlbumListSortOptions.COMMUNITY_RATING]: 'Community Rating',
    [AlbumListSortOptions.CRITIC_RATING]: 'Critic Rating',
    [AlbumListSortOptions.DATE_ADDED]: 'Date Added',
    [AlbumListSortOptions.DATE_PLAYED]: 'Date Played',
    [AlbumListSortOptions.DURATION]: 'Duration',
    [AlbumListSortOptions.IS_FAVORITE]: 'Is Favorite',
    [AlbumListSortOptions.NAME]: 'Name',
    [AlbumListSortOptions.PLAY_COUNT]: 'Play Count',
    [AlbumListSortOptions.RANDOM]: 'Random',
    [AlbumListSortOptions.RELEASE_DATE]: 'Release Date',
    [AlbumListSortOptions.TRACK_COUNT]: 'Track Count',
    [AlbumListSortOptions.YEAR]: 'Year',
};

function getSortOptions(
    features: LibraryFeatures,
): { name: string; value: AlbumListSortOptions }[] {
    const albumSortFeatures = Object.keys(features)
        .filter((key) => key.includes('album:list:filter'))
        .filter((key) => features[key as keyof LibraryFeatures]);

    return albumSortFeatures.map((feature) => {
        const option = feature.replace('album:list:filter:', '') as AlbumListSortOptions;
        return {
            name: albumSortLabelMap[option],
            value: option,
        };
    });
}
