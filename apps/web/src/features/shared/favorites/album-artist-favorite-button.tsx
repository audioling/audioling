import type { AlbumArtistItem } from '@/api/api-types.ts';
import { useFavoriteAlbumArtist } from '@/features/favorites/hooks/use-favorite-album-artist.ts';
import { useUnfavoriteAlbumArtist } from '@/features/favorites/hooks/use-unfavorite-album-artist.ts';
import type { IconButtonProps } from '@/features/ui/icon-button/icon-button.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';

interface AlbumArtistFavoriteButtonProps {
    buttonProps?: Partial<IconButtonProps>;
    data: AlbumArtistItem;
}

export function AlbumArtistFavoriteButton({ buttonProps, data }: AlbumArtistFavoriteButtonProps) {
    const isFavorite = data?.userFavorite;

    const { mutate: favoriteAlbumArtist } = useFavoriteAlbumArtist();
    const { mutate: unfavoriteAlbumArtist } = useUnfavoriteAlbumArtist();

    const handleFavorite = () => {
        if (!data) return;

        if (isFavorite) {
            unfavoriteAlbumArtist({
                data: { ids: [data.id] },
                libraryId: data.libraryId,
            });
        } else {
            favoriteAlbumArtist({
                data: { ids: [data.id] },
                libraryId: data.libraryId,
            });
        }
    };

    return (
        <IconButton
            isCompact
            icon="favorite"
            iconFill={isFavorite}
            iconProps={{ state: isFavorite ? 'primary' : undefined }}
            size="lg"
            onClick={handleFavorite}
            {...buttonProps}
        />
    );
}
