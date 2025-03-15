import { ActionIcon, Divider, Menu } from '@mantine/core';
import { Icon } from '/@/components/icon/icon';
import { useAuthStore } from '/@/stores/auth-store';

export function FileMenu() {
    // const signOutLibrary = useLibrarySignOut();
    // const permissions = useAuthPermissions();

    const signOut = useAuthStore.use.signOut();

    // const canManageUsers
    //     = permissions['user:add'] || permissions['user:edit'] || permissions['user:remove'];

    return (
        <Menu>
            <Menu.Target>
                <ActionIcon variant="subtle">
                    <Icon icon="menu" />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item disabled leftSection={<Icon icon="settings" />}>
                    Settings
                </Menu.Item>
                <Divider />
                <Menu.Item leftSection={<Icon icon="signOut" />} onClick={() => signOut(null)}>
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
            </Menu.Dropdown>
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
