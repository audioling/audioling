import type { TrackItem } from '@/api/api-types.ts';
import { useFavoriteTrack } from '@/features/favorites/hooks/use-favorite-track.ts';
import { useUnfavoriteTrack } from '@/features/favorites/hooks/use-unfavorite-track.ts';
import type { IconButtonProps } from '@/features/ui/icon-button/icon-button.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';

interface TrackFavoriteButtonProps {
    buttonProps?: Partial<IconButtonProps>;
    data: TrackItem;
}

export function TrackFavoriteButton({ buttonProps, data }: TrackFavoriteButtonProps) {
    const isFavorite = data?.userFavorite;

    const { mutate: favoriteTrack } = useFavoriteTrack();
    const { mutate: unfavoriteTrack } = useUnfavoriteTrack();

    const handleFavorite = () => {
        if (!data) return;

        if (isFavorite) {
            unfavoriteTrack({
                data: { ids: [data.id] },
                libraryId: data.libraryId,
            });
        } else {
            favoriteTrack({
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
