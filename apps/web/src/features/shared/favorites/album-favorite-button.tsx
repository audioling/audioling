import type { AlbumItem } from '@/api/api-types.ts';
import { useFavoriteAlbum } from '@/features/favorites/hooks/use-favorite-album.ts';
import { useUnfavoriteAlbum } from '@/features/favorites/hooks/use-unfavorite-album.ts';
import type { IconButtonProps } from '@/features/ui/icon-button/icon-button.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';

interface AlbumFavoriteButtonProps {
    buttonProps?: Partial<IconButtonProps>;
    data: AlbumItem;
}

export function AlbumFavoriteButton({ buttonProps, data }: AlbumFavoriteButtonProps) {
    const isFavorite = data?.userFavorite;

    const { mutate: favoriteAlbum } = useFavoriteAlbum();
    const { mutate: unfavoriteAlbum } = useUnfavoriteAlbum();

    const handleFavorite = () => {
        if (!data) return;

        if (isFavorite) {
            unfavoriteAlbum({
                data: { ids: [data.id] },
                libraryId: data.libraryId,
            });
        } else {
            favoriteAlbum({
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
