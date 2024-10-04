// import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
// import type { RootContext } from '@/app.tsx';

// const IndexComponent = () => {
//     return <Outlet />;
// };

// export const Route = createFileRoute('/')({
//     beforeLoad: (args) => {
//         const context = args.context as RootContext;

//         if (!context.auth) {
//             throw redirect({
//                 search: {
//                     redirect: args.location.href,
//                 },
//                 to: '/authentication',
//             });
//         }

//         throw redirect({ to: '/app' });
//     },
//     component: IndexComponent,
// });
