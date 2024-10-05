import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/$libraryId/album/detail')({
    component: () => <div>Hello /dashboard/$libraryId/album/detail!</div>,
});
