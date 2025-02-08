import { useLibrarySignOut } from '@/features/authentication/stores/auth-store.ts';
import { Divider } from '@/features/ui/divider/divider.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { Menu } from '@/features/ui/menu/menu.tsx';
import { EditProfileModal } from '@/features/users/edit-profile/edit-profile.tsx';
import { useAuthPermissions } from '@/permissions.ts';

export function FileMenu() {
    const signOutLibrary = useLibrarySignOut();
    const permissions = useAuthPermissions();

    const canManageUsers =
        permissions['user:add'] || permissions['user:edit'] || permissions['user:remove'];

    return (
        <Menu>
            <Menu.Target>
                <IconButton icon="menu" size="lg" variant="default" />
            </Menu.Target>
            <Menu.Content>
                <Menu.Item disabled leftIcon="settings">
                    Settings
                </Menu.Item>
                <Divider />
                <Menu.Divider />
                {canManageUsers && (
                    <Menu.Item disabled leftIcon="userManage">
                        Manage users
                    </Menu.Item>
                )}
                <Menu.Item leftIcon="user" onSelect={() => EditProfileModal()}>
                    Edit profile
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item leftIcon="signOut" onSelect={signOutLibrary}>
                    Sign out
                </Menu.Item>
                {/* <Menu.Divider />
                <Menu.Label>
                    <Stack>
                        <Library />
                        <Suspense fallback={<LibraryDisplay isLoading={true} type="Remote" />}>
                            <RemoteLibrary />
                        </Suspense>
                    </Stack>
                </Menu.Label> */}
            </Menu.Content>
        </Menu>
    );
}

// interface LibraryDisplayLoadedProps {
//     baseUrl: string;
//     type: 'Local' | 'Remote';
//     username: string;
// }

// interface LibraryDisplaySkeletonProps {
//     isLoading: boolean;
//     type: 'Local' | 'Remote';
// }

// type LibraryDisplayProps = LibraryDisplayLoadedProps | LibraryDisplaySkeletonProps;

// function LibraryDisplay(props: LibraryDisplayProps) {
//     if ('isLoading' in props) {
//         return (
//             <Stack gap="md">
//                 <Stack gap="xs">
//                     <Text size="sm">{props.type}</Text>
//                     <Paper>
//                         <Stack gap="xs">
//                             <Text>
//                                 <Skeleton />
//                             </Text>
//                             <Text isSecondary>
//                                 <Skeleton />
//                             </Text>
//                         </Stack>
//                     </Paper>
//                 </Stack>
//             </Stack>
//         );
//     }

//     const { baseUrl, username } = props;

//     return (
//         <Stack gap="md">
//             <Stack gap="xs">
//                 <Text size="sm">{props.type}</Text>
//                 <Paper>
//                     <Stack gap="xs">
//                         <Text>{username}</Text>
//                         <Text isSecondary>{baseUrl}</Text>
//                     </Stack>
//                 </Paper>
//             </Stack>
//         </Stack>
//     );
// }

// function Library() {
//     const user = useAuthUser();
//     const baseUrl = useAuthBaseUrl();

//     return <LibraryDisplay baseUrl={baseUrl} type="Local" username={user?.username ?? 'Unknown'} />;
// }

// function RemoteLibrary() {
//     const { data: libraries } = useGetApiLibrariesSuspense({
//         sortBy: LibraryListSortOptions.NAME,
//         sortOrder: ListSortOrder.ASC,
//     });

//     const selectedLibraryId = useSelectedLibraryId();
//     const selectedLibrary = libraries.data.find((lib) => lib.id === selectedLibraryId);

//     if (!selectedLibrary) {
//         return null;
//     }

//     return (
//         <LibraryDisplay
//             baseUrl={selectedLibrary?.baseUrl ?? ''}
//             type="Remote"
//             username={selectedLibrary?.displayName ?? ''}
//         />
//     );
// }
