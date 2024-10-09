import { Suspense } from 'react';
import { useAuthSignOut } from '@/features/authentication/stores/auth-store.ts';
import { LibrarySelection } from '@/features/library/library-selection/library-selection.tsx';
import { Button } from '@/features/ui/button/button.tsx';
import { Center } from '@/features/ui/center/center.tsx';
import { Divider } from '@/features/ui/divider/divider.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';

export const LibrarySelectionRoute = () => {
    const signOut = useAuthSignOut();

    return (
        <Center p="md">
            <Stack>
                <Suspense fallback={<></>}>
                    <LibrarySelection />
                </Suspense>
                <Divider label="Or" />
                <Button
                    variant="danger"
                    onClick={signOut}
                >
                    Sign out
                </Button>
            </Stack>
        </Center>
    );
};
