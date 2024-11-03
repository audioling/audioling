import { useId } from 'react';
import { createCallable } from 'react-call';
import { CreatePlaylistFolderForm } from '@/features/playlists/create-playlist-folder/create-playlist-folder-form.tsx';
import { Button } from '@/features/ui/button/button.tsx';
import { Modal } from '@/features/ui/modal/modal.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';

interface CreatePlaylistFolderModalProps {
    libraryId: string;
}

export const CreatePlaylistFolderModal = createCallable<CreatePlaylistFolderModalProps, boolean>(
    ({ call, libraryId }) => {
        const formId = useId();

        return (
            <Modal
                isClosing={call.ended}
                title={'Create Playlist Folder'}
                onClose={() => call.end(false)}
            >
                <Stack>
                    <CreatePlaylistFolderForm
                        formId={formId}
                        libraryId={libraryId}
                        onSuccess={() => call.end(true)}
                    />
                    <Modal.ButtonGroup>
                        <Button
                            form={formId}
                            type="button"
                            variant="default"
                            onClick={() => call.end(false)}
                        >
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
