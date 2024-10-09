import { Suspense } from 'react';
import { useAuthSignOut } from '@/features/authentication/stores/auth-store.ts';
import { LibrarySelectionForm } from '@/features/library/components/library-selection-form.tsx';
import { Button } from '@/features/ui/button/button.tsx';
import { Center } from '@/features/ui/center/center.tsx';
import { Divider } from '@/features/ui/divider/divider.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';

export const LibrarySelectionRoute = () => {
    const signOut = useAuthSignOut();

    return (
        <Center>
            <Stack>
                <Suspense fallback={<></>}>
                    <LibrarySelectionForm />
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
