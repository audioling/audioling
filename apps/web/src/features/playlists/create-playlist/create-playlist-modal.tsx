import { useId } from 'react';
import { createCallable } from 'react-call';
import { CreatePlaylistForm } from '@/features/playlists/create-playlist/create-playlist-form.tsx';
import { Button } from '@/features/ui/button/button.tsx';
import { Modal } from '@/features/ui/modal/modal.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';

interface CreatePlaylistModalProps {
    libraryId: string;
}

export const CreatePlaylistModal = createCallable<CreatePlaylistModalProps, boolean>(
    ({ call, libraryId }) => {
        const formId = useId();

        console.log('formId', formId, libraryId);

        return (
            <Modal isClosing={call.ended} title={'Create Playlist'} onClose={() => call.end(false)}>
                <Stack>
                    <CreatePlaylistForm
                        formId={formId}
                        libraryId={libraryId}
                        onSuccess={() => call.end(true)}
                    />
                    <Modal.ButtonGroup>
                        <Button form={formId} type="button" variant="default">
                            Cancel
                        </Button>
                        <Button form={formId} type="submit" variant="filled">
                            Create
                        </Button>
                    </Modal.ButtonGroup>
                </Stack>
            </Modal>
        );
    },
    300,
);
