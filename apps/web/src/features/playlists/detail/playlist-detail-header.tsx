import { Fragment, useCallback, useMemo } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { generatePath, useNavigate } from 'react-router';
import type { PlaylistItem } from '@/api/api-types.ts';
import { useDeleteApiLibraryIdPlaylistsId } from '@/api/openapi-generated/playlists/playlists.ts';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { PlayType } from '@/features/player/stores/player-store.tsx';
import { UpdatePlaylistForm } from '@/features/playlists/update-playlist/update-playlist-form.tsx';
import { ConfirmationModal } from '@/features/shared/confirmation-modal/confirmation-modal.tsx';
import { ItemImage } from '@/features/shared/item-image/item-image.tsx';
import { Button } from '@/features/ui/button/button.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Menu } from '@/features/ui/menu/menu.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import { Title } from '@/features/ui/title/title.tsx';
import { APP_ROUTE } from '@/routes/app-routes.ts';
import { formatDateTime } from '@/utils/format-date.ts';
import { formatHumanDuration } from '@/utils/format-duration.ts';
import styles from './playlist-detail-header.module.scss';

export function PlaylistDetailHeader({ playlist }: { playlist: PlaylistItem }) {
    const groupedData = useMemo(() => {
        const data = [
            {
                id: 'trackCount',
                value: playlist.trackCount ? `${playlist.trackCount} tracks` : null,
            },
            {
                id: 'duration',
                value: playlist.duration ? formatHumanDuration(playlist.duration) : null,
            },
            {
                id: 'isPublic',
                value: playlist.isPublic ? 'Public' : 'Private',
            },
            {
                id: 'owner',
                value: playlist.owner ? `Created by ${playlist.owner}` : null,
            },
        ];

        return data.filter((item) => item.value !== null);
    }, [playlist]);

    const dateData = useMemo(() => {
        const data = [
            {
                id: 'updatedDate',
                value: playlist.updatedDate
                    ? `Updated - ${formatDateTime(playlist.updatedDate)}`
                    : null,
            },
        ];

        return data.filter((item) => item.value !== null);
    }, [playlist]);

    return (
        <div className={styles.header}>
            <div className={styles.grid}>
                <div className={styles.imageArea}>
                    <ItemImage
                        className={styles.image}
                        containerClassName={styles.imageContainer}
                        size="card"
                        src={playlist.imageUrl}
                    />
                </div>
                <div className={styles.contentArea}>
                    <div className={styles.metadata}>
                        <Title
                            isNoSelect
                            className={styles.title}
                            lineClamp={2}
                            order={1}
                            size="lg"
                            weight="lg"
                        >
                            {playlist.name}
                        </Title>
                        {playlist.description && (
                            <Text
                                isSecondary
                                className={styles.description}
                                lineClamp={2}
                                weight="lg"
                            >
                                {playlist.description}
                            </Text>
                        )}
                        <Group className={styles.metadataGroup} gap="sm" wrap="wrap">
                            {groupedData.map((item, index) => (
                                <Fragment key={item.id}>
                                    <Text isSecondary lineClamp={1} weight="lg">
                                        {item.value}
                                    </Text>
                                    <Text isSecondary>
                                        {index < groupedData.length - 1 && ' -'}
                                    </Text>
                                </Fragment>
                            ))}
                        </Group>
                        <Group gap="sm">
                            {dateData.map((item, index) => (
                                <Fragment key={item.id}>
                                    <Text isSecondary weight="lg">
                                        {item.value}
                                    </Text>
                                    <Text isSecondary>{index < dateData.length - 1 && '|'}</Text>
                                </Fragment>
                            ))}
                        </Group>
                    </div>
                    <Controls playlist={playlist} />
                </div>
            </div>
        </div>
    );
}

// const playlistTrackSortOptions = Object.keys(trackSortLabelMap).map((key) => ({
//     label: trackSortLabelMap[key as keyof typeof trackSortLabelMap],
//     value: key,
// }));

function Controls({ playlist }: { playlist: PlaylistItem }) {
    const handlePlay = useCallback(
        (type: PlayType) => {
            PlayerController.call({
                cmd: {
                    addToQueueByFetch: {
                        id: [playlist.id],
                        itemType: LibraryItemType.PLAYLIST,
                        type,
                    },
                },
            });
        },
        [playlist],
    );

    return (
        <div className={styles.controls}>
            <div className={styles.leftControls}>
                <Group gap="sm">
                    <Button
                        leftIcon="mediaPlay"
                        leftIconProps={{ fill: true }}
                        variant="primary"
                        onClick={() => handlePlay(PlayType.NOW)}
                    >
                        Play
                    </Button>
                    <IconButton
                        iconFill
                        icon="arrowRightS"
                        variant="primary"
                        onClick={() => handlePlay(PlayType.NEXT)}
                    />
                    <IconButton
                        iconFill
                        icon="arrowRightLast"
                        variant="primary"
                        onClick={() => handlePlay(PlayType.LAST)}
                    />
                </Group>
            </div>
            <div className={styles.rightControls}>
                <Group gap="xs">
                    {/* <ListSortByButton
                        buttonProps={{
                            isCompact: true,
                            leftIcon: 'sort',
                            size: 'md',
                            variant: 'default',
                        }}
                        options={playlistTrackSortOptions}
                        sort={sortBy}
                        onSortChanged={setSortBy}
                    /> */}
                    {/* <IconButtonWithTooltip
                        isCompact
                        icon="sortDesc"
                        tooltipProps={{ label: 'Sort Descending' }}
                    /> */}
                    {/* <IconButtonWithTooltip
                        isCompact
                        icon="search"
                        tooltipProps={{ label: 'Search' }}
                    /> */}
                    <PlaylistMenu playlist={playlist} />
                </Group>
            </div>
        </div>
    );
}

function PlaylistMenu({ playlist }: { playlist: PlaylistItem }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { mutate: deletePlaylist } = useDeleteApiLibraryIdPlaylistsId();

    const handleEdit = useCallback(() => {
        ConfirmationModal.call({
            children: (
                <UpdatePlaylistForm
                    formId="update-playlist-form"
                    libraryId={playlist.libraryId}
                    playlist={playlist}
                    onSuccess={() => {}}
                />
            ),
            formId: 'update-playlist-form',
            labels: {
                cancel: 'Cancel',
                confirm: 'Update',
                title: 'Update Playlist',
            },
            onCancel: async () => {},
            onConfirm: async () => {
                await queryClient.invalidateQueries({
                    queryKey: [`/api/${playlist.libraryId}/playlists`],
                });

                await queryClient.invalidateQueries({
                    queryKey: [`/api/${playlist.libraryId}/playlists/${playlist.id}`],
                });
            },
        });
    }, [playlist, queryClient]);

    const handleDelete = useCallback(() => {
        ConfirmationModal.call({
            onCancel: async () => {},
            onConfirm: async () => {
                deletePlaylist(
                    { id: playlist.id, libraryId: playlist.libraryId },
                    {
                        onSuccess: async () => {
                            await queryClient.invalidateQueries({
                                queryKey: [`/api/${playlist.libraryId}/playlists`],
                            });

                            await queryClient.invalidateQueries({
                                queryKey: itemListHelpers.getListQueryKey(
                                    playlist.libraryId,
                                    'playlists',
                                    LibraryItemType.PLAYLIST,
                                ),
                            });

                            await queryClient.invalidateQueries({
                                queryKey: itemListHelpers.getDataQueryKey(
                                    playlist.libraryId,
                                    LibraryItemType.PLAYLIST,
                                ),
                            });

                            const playlistPath = generatePath(APP_ROUTE.DASHBOARD_PLAYLISTS, {
                                libraryId: playlist.libraryId,
                            });

                            await navigate(playlistPath, { replace: true });
                        },
                    },
                );
            },
        });
    }, [deletePlaylist, navigate, playlist.id, playlist.libraryId, queryClient]);

    return (
        <Menu>
            <Menu.Target>
                <IconButton isCompact icon="ellipsisHorizontal" />
            </Menu.Target>
            <Menu.Content>
                <Menu.Item leftIcon="edit" onSelect={handleEdit}>
                    Edit
                </Menu.Item>
                <Menu.Item leftIcon="delete" onSelect={handleDelete}>
                    Delete
                </Menu.Item>
            </Menu.Content>
        </Menu>
    );
}
