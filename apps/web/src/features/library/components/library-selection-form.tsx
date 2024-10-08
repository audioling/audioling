import { useMemo } from 'react';
import { LibraryListSortOptions, ListSortOrder } from '@repo/shared-types';
import { useNavigate } from 'react-router-dom';
import { useGetApiLibrariesSuspense } from '@/api/openapi-generated/libraries/libraries.ts';
import { useAuthLibraries } from '@/features/authentication/stores/auth-store.ts';
import { LibraryItem } from '@/features/library/components/library-item.tsx';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { MotionStack, Stack } from '@/features/ui/stack/stack.tsx';
import { Title } from '@/features/ui/title/title.tsx';

export const LibrarySelectionForm = () => {
    const navigate = useNavigate();
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

    return (
        <Stack
            align="center"
            maw="300px"
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
                    Select a library
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
                        onClick={(id) => {
                            console.log(id, 'clicked');
                        }}
                    />
                ))}
            </MotionStack>
        </Stack>
    );
};
