import { SidePlayQueue } from '@/features/player/now-playing/side-play-queue.tsx';

export function NowPlayingRoute() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            <SidePlayQueue />
        </div>
    );
}
