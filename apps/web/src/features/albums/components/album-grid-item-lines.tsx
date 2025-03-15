import type { AlbumItem } from '/@/app-types';
import type { ItemCardProps } from '/@/features/shared/components/item-card/item-card';

export const albumGridItemLines: ItemCardProps<AlbumItem>['lines'] = [
    { property: 'name' },
    { property: 'artists.name' },
    {
        property: 'releaseYear',
        transform: (data: AlbumItem) => {
            const { maxReleaseYear, minReleaseYear } = data;

            if (minReleaseYear === maxReleaseYear) {
                return minReleaseYear?.toString() || '';
            }

            return `${minReleaseYear} - ${maxReleaseYear}`;
        },
    },
];
