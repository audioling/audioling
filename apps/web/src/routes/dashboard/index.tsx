import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/')({
    component: () => <div>Hello /dashboard/!</div>,
});
