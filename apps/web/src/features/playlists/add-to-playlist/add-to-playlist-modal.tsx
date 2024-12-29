import { Suspense, useId, useState } from 'react';
import { createCallable } from 'react-call';
import type { AlbumItem, ArtistItem, TrackItem } from '@/api/api-types.ts';
import { AddToPlaylistForm } from '@/features/playlists/add-to-playlist/add-to-playlist-form.tsx';
import { Button } from '@/features/ui/button/button.tsx';
import { Modal } from '@/features/ui/modal/modal.tsx';
import { Spinner } from '@/features/ui/spinner/spinner.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';

interface AddToPlaylistModalProps {
    albums?: AlbumItem[];
    artists?: ArtistItem[];
    libraryId: string;
    playlistId: string;
    tracks?: TrackItem[];
}

export const AddToPlaylistModal = createCallable<AddToPlaylistModalProps, boolean>(
    ({ call, libraryId, playlistId, albums, artists, tracks }) => {
        const formId = useId();
        const [isLoading, setIsLoading] = useState(false);

        return (
            <Modal isClosing={call.ended} title={'Add to playlist'} onClose={() => call.end(false)}>
                <Stack>
                    <Suspense fallback={<Spinner />}>
                        <AddToPlaylistForm
                            albums={albums}
                            artists={artists}
                            formId={formId}
                            libraryId={libraryId}
                            playlistId={playlistId}
                            setIsLoading={setIsLoading}
                            tracks={tracks}
                            onSuccess={() => call.end(true)}
                        />
                    </Suspense>
                    <Modal.ButtonGroup>
                        <Button
                            form={formId}
                            type="button"
                            variant="default"
                            onClick={() => call.end(false)}
                        >
                            Cancel
                        </Button>
                        <Button form={formId} isLoading={isLoading} type="submit" variant="filled">
                            Add
                        </Button>
                    </Modal.ButtonGroup>
                </Stack>
            </Modal>
        );
    },
    300,
);
