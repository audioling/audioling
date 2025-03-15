import { ActionIcon } from '@mantine/core';
import { Icon } from '/@/components/icon/icon';
import { useCurrentTrack } from '/@/stores/player-store';

export function TrackFavoriteButton() {
    const currentTrack = useCurrentTrack();
    const isFavorite = currentTrack?.track?.userFavorite;

    // const { mutate: favoriteTrack } = useFavoriteTrack();
    // const { mutate: unfavoriteTrack } = useUnfavoriteTrack();

    // const handleFavorite = () => {
    //     if (!currentTrack?.track)
    //         return;

    //     if (isFavorite) {
    //         unfavoriteTrack({
    //             data: { ids: [currentTrack?.track?.id] },
    //             libraryId: currentTrack?.track?.libraryId,
    //         });
    //     }
    //     else {
    //         favoriteTrack({
    //             data: { ids: [currentTrack?.track?.id] },
    //             libraryId: currentTrack?.track?.libraryId,
    //         });
    //     }
    // };

    return (

        <ActionIcon
            size="lg"
            variant="transparent"
            // onClick={handleFavorite}
        >
            <Icon fill={isFavorite ? 'secondary' : undefined} icon="favorite" />
        </ActionIcon>
    );
}
