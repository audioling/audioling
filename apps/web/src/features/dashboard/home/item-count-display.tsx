import { ItemCountCard } from '@/features/dashboard/home/item-count-card.tsx';
import { Grid } from '@/features/ui/grid/grid.tsx';
import { Group } from '@/features/ui/group/group.tsx';

export function ItemCountDisplay() {
    // const { data: albumsCount } = useGetAlbumsCountQuery();
    // const { data: artistsCount } = useGetArtistsCountQuery();
    // const { data: tracksCount } = useGetTracksCountQuery();
    // const { data: genresCount } = useGetGenresCountQuery();

    return (
        <Grid>
            <Grid.Col span={4}>
                <ItemCountCard count={10} label="Albums" />
            </Grid.Col>
            <Grid.Col span={4}>
                <ItemCountCard count={10} label="Artists" />
            </Grid.Col>
            <Grid.Col span={4}>
                <ItemCountCard count={10} label="Tracks" />
            </Grid.Col>
            <Grid.Col span={4}>
                <ItemCountCard count={10} label="Genres" />
            </Grid.Col>
        </Grid>
    );
}
