import { useMemo } from 'react';
import { useGetApiLibrariesIdSuspense } from '@/api/openapi-generated/libraries/libraries.ts';
import { Button } from '@/features/ui/button/button.tsx';
import { Menu } from '@/features/ui/menu/menu.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import { useDashboardParams } from '@/hooks/use-dashboard-params.ts';

interface ListFolderFilterButtonProps {
    folderId: string[];
    onFolderChanged: (folderId: string[]) => void;
}

export function ListFolderFilterButton({ folderId, onFolderChanged }: ListFolderFilterButtonProps) {
    const { libraryId } = useDashboardParams();
    const { data: library } = useGetApiLibrariesIdSuspense(libraryId);

    const options = useMemo(
        () =>
            library?.data.folders.map((folder) => ({
                label: folder.name,
                value: folder.id,
            })),
        [library],
    );

    const label = getLabel(folderId, options);

    const handleSelect = (id: string) => {
        if (folderId.includes(id)) {
            onFolderChanged(folderId.filter((f) => f !== id));
        } else {
            onFolderChanged([...folderId, id]);
        }
    };

    return (
        <Menu align="start" side="bottom">
            <Menu.Target>
                <Button isCompact leftIcon="folder" size="lg" variant="outline">
                    <Text>{label || 'All'}</Text>
                </Button>
            </Menu.Target>
            <Menu.Content>
                {options.map((option) => (
                    <Menu.Item
                        key={`sort-${option.value}`}
                        isSelected={folderId.includes(option.value)}
                        onSelect={() => handleSelect(option.value)}
                    >
                        {option.label}
                    </Menu.Item>
                ))}
            </Menu.Content>
        </Menu>
    );
}

function getLabel(folderId: string[], options: { label: string; value: string }[]) {
    if (folderId.length === 0) {
        return 'All';
    }

    if (folderId.length === 1) {
        return options.find((option) => option.value === folderId[0])?.label;
    }

    return `${folderId.length} folders`;
}
