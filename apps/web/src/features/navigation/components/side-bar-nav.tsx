import { useEffect } from 'react';
import { SidebarPlaylistItem } from '@/features/navigation/components/side-bar-playlist-item.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';

export const SideBar = () => {
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:4544/jobs/ws');

        socket.onopen = (event) => {
            console.log('open', event);
        };

        socket.onmessage = (event) => {
            console.log('message', event);
        };

        socket.onclose = (event) => {
            console.log('close', event);
        };

        // socket.addEventListener('message', (event) => {
        //   console.log('message', event);
        // });

        // // socket opened
        // socket.addEventListener('open', (event) => {
        //   console.log('open', event);
        // });

        // // socket closed
        // socket.addEventListener('close', (event) => {
        //   console.log('close', event);
        // });

        // // error handler
        // socket.addEventListener('error', (event) => {
        //   console.log('error', event);
        // });

        // socket.addEventListener('open', () => {
        //   setInterval(() => {
        //     socket.send(new Date().toString());
        //   }, 1000);
        // });

        return () => {
            socket.close();
        };
    }, []);

    return (
        <Stack>
            <SidebarPlaylistItem
                dropId="sidebar-playlist-1"
                name={'Playlist 1'}
            />
            <SidebarPlaylistItem
                dropId="sidebar-playlist-2"
                name={'Playlist 2'}
            />
            <SidebarPlaylistItem
                dropId="sidebar-playlist-3"
                name={'Playlist 3'}
            />
            <SidebarPlaylistItem
                dropId="sidebar-playlist-4"
                name={'Playlist 4'}
            />
            <SidebarPlaylistItem
                dropId="sidebar-playlist-5"
                name={'Playlist 5'}
            />
        </Stack>
    );
};
