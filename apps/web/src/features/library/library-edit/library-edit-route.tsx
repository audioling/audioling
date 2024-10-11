import { useNavigate, useParams } from 'react-router-dom';
import { useGetApiLibrariesIdSuspense } from '@/api/openapi-generated/libraries/libraries.ts';
import { LibraryEditForm } from '@/features/library/library-edit/library-edit-form.tsx';
import { Center } from '@/features/ui/center/center.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { Title } from '@/features/ui/title/title.tsx';

export const LibraryEditRoute = () => {
    const navigate = useNavigate();
    const { libraryId } = useParams<{ libraryId: string }>() as { libraryId: string };
    const { data: library } = useGetApiLibrariesIdSuspense(libraryId);

    return (
        <Center>
            <Stack w="320px">
                <Group gap="xs">
                    <IconButton
                        icon="arrowLeft"
                        onClick={() => navigate(-1)}
                    />
                    <Title
                        order={1}
                        size="lg"
                    >
                        Edit {library.data.displayName}
                    </Title>
                </Group>
                <LibraryEditForm />
            </Stack>
        </Center>
    );
};
