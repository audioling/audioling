import { useMemo } from 'react';
import { LibraryListSortOptions, ListSortOrder } from '@repo/shared-types';
import { generatePath, useNavigate } from 'react-router-dom';
import { useGetApiLibrariesSuspense } from '@/api/openapi-generated/libraries/libraries.ts';
import { useAuthLibraries } from '@/features/authentication/stores/auth-store.ts';
import type { LibraryItemLibrary } from '@/features/library/components/library-item.tsx';
import { LibraryItem } from '@/features/library/components/library-item.tsx';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { MotionButton } from '@/features/ui/button/button.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { MotionStack, Stack } from '@/features/ui/stack/stack.tsx';
import { Title } from '@/features/ui/title/title.tsx';
import { useAuthPermissions } from '@/permissions.ts';
import { APP_ROUTE } from '@/routes/app-routes.ts';

export const LibrarySelection = () => {
    const navigate = useNavigate();
    const permissions = useAuthPermissions();

    const addLibraryPermission = permissions['library:add'];

    const { data: serverLibraries } = useGetApiLibrariesSuspense({
        sortBy: LibraryListSortOptions.NAME,
        sortOrder: ListSortOrder.ASC,
    });

    const authLibraries = useAuthLibraries();

    const libraries = useMemo(() => {
        return serverLibraries?.data.map((library) => {
            if (authLibraries[library.id]) {
                return {
                    ...library,
                    isLocked:
                        !authLibraries[library.id].credential ||
                        !authLibraries[library.id].username,
                };
            }

            return {
                ...library,
                isLocked: true,
            };
        });
    }, [authLibraries, serverLibraries?.data]);

    const handleSelectLibrary = (library: LibraryItemLibrary) => {
        const path = generatePath(APP_ROUTE.DASHBOARD_LIBRARY_AUTH, { libraryId: library.id });
        navigate(path);
    };

    const handleEditLibrary = (library: LibraryItemLibrary) => {
        const path = generatePath(APP_ROUTE.DASHBOARD_LIBRARY_EDIT, { libraryId: library.id });
        navigate(path);
    };

    const handleAddLibrary = () => {
        navigate(APP_ROUTE.DASHBOARD_LIBRARY_ADD);
    };

    return (
        <Stack
            align="center"
            maw="400px"
            miw="250px"
            w="100%"
        >
            <Group
                justify="start"
                w="100%"
            >
                <IconButton
                    icon="arrowLeft"
                    onClick={() => navigate(-1)}
                />
                <Title
                    order={1}
                    size="lg"
                >
                    Libraries
                </Title>
            </Group>
            <MotionStack
                animate="show"
                initial="hidden"
                variants={animationVariants.stagger(animationVariants.fadeIn)}
                w="100%"
            >
                {libraries?.map((library) => (
                    <LibraryItem
                        key={library.id}
                        library={library}
                        onEdit={handleEditLibrary}
                        onSelect={handleSelectLibrary}
                    />
                ))}
                {addLibraryPermission && (
                    <MotionButton
                        justify="between"
                        rightIcon="add"
                        variant="filled"
                        variants={animationVariants.fadeIn}
                        onClick={handleAddLibrary}
                    >
                        Add a library
                    </MotionButton>
                )}
            </MotionStack>
        </Stack>
    );
};
