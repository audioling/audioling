import type { ColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { Group } from '@/features/ui/group/group.tsx';
import { Icon } from '@/features/ui/icon/icon.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

export function addToPlaylistColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row, context }) => {
            const item = row.original;
            const isPlaying = row.id === context?.currentTrack?._uniqueId;

            if (typeof item === 'object' && item) {
                if ('name' in item && typeof item.name === 'string') {
                    const isSkipped = item.name.includes('__duplicate_skip__');

                    return (
                        <div
                            className={clsx(styles.cell, {
                                [styles.playing]: isPlaying,
                            })}
                        >
                            <Group justify="between">
                                <Text isEllipsis style={{ maxWidth: '80%' }}>
                                    {item.name
                                        .replace('__duplicate__', '')
                                        .replace('__duplicate_skip__', '')}
                                </Text>
                                {item.name.includes('__duplicate') && (
                                    <Icon
                                        icon="remove"
                                        size="lg"
                                        state={isSkipped ? 'error' : 'warn'}
                                    />
                                )}
                            </Group>
                        </div>
                    );
                }
            }

            return <Skeleton height={20} width={100} />;
        },
        header: 'Name',
        id: 'addToPlaylist',
        size: itemListHelpers.table.numberToColumnSize(1, 'fr'),
    });
}
