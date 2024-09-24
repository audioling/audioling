import { createFileRoute, redirect } from '@tanstack/react-router';
import type { RootContext } from '@/app.tsx';
import { AuthenticationRoute } from '@/features/authentication/page/authentication-route.tsx';

export const Route = createFileRoute('/authentication')({
    beforeLoad: (args) => {
        const context = args.context as RootContext;

        if (context.auth) {
            throw redirect({
                to: '/app',
            });
        }
    },
    component: AuthenticationRoute,
});
