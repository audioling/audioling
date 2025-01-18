import { useFavoriteTrack } from '@/features/favorites/hooks/use-favorite-track.ts';
import { useUnfavoriteTrack } from '@/features/favorites/hooks/use-unfavorite-track.ts';
import { useCurrentTrack } from '@/features/player/stores/player-store.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';

export function TrackFavoriteButton() {
    const currentTrack = useCurrentTrack();
    const isFavorite = currentTrack?.track?.userFavorite;

    const { mutate: favoriteTrack } = useFavoriteTrack();
    const { mutate: unfavoriteTrack } = useUnfavoriteTrack();

    const handleFavorite = () => {
        if (!currentTrack?.track) return;

        if (isFavorite) {
            unfavoriteTrack({
                data: { ids: [currentTrack?.track?.id] },
                libraryId: currentTrack?.track?.libraryId,
            });
        } else {
            favoriteTrack({
                data: { ids: [currentTrack?.track?.id] },
                libraryId: currentTrack?.track?.libraryId,
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
        />
    );
}
