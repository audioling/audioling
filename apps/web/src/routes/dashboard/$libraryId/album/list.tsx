import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/$libraryId/album/list')({
    component: () => <div>Hello /dashboard/$libraryId/album/list!</div>,
});
