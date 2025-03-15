import { AudiolingWebPlayer } from '/@/features/player/components/audio-player/audioling-web-player';

export interface AudioPlayerProps {
    getCurrentTime: () => number;
    getDuration: () => number;
    onPlayerProgress: (time: number) => void;
    pause: () => void;
    play: () => void;
    setCurrentTime: (time: number) => void;
    setMuted: (muted: boolean) => void;
    setVolume: (volume: number) => void;
    stop: () => void;
}

export function AudioPlayer() {
    // const { currentTrack, player } = usePlayerData();

    // useEffect(() => {
    //     navigator.mediaSession.setActionHandler('play', () => {
    //         PlayerController.call({ cmd: { mediaPlay: null } });
    //     });

    //     navigator.mediaSession.setActionHandler('pause', () => {
    //         PlayerController.call({ cmd: { mediaPause: null } });
    //     });

    //     navigator.mediaSession.setActionHandler('previoustrack', () => {
    //         PlayerController.call({ cmd: { mediaPrevious: null } });
    //     });

    //     navigator.mediaSession.setActionHandler('nexttrack', () => {
    //         PlayerController.call({ cmd: { mediaNext: null } });
    //     });

    //     navigator.mediaSession.setActionHandler('stop', () => {
    //         PlayerController.call({ cmd: { mediaPause: null } });
    //     });

    //     if (currentTrack) {
    //         navigator.mediaSession.metadata = new MediaMetadata({
    //             album: currentTrack.album || 'Unknown Album',
    //             artist: currentTrack.artists.map(artist => artist.name).join(', '),
    //             artwork: [
    //                 {
    //                     src: getImageUrl(currentTrack.imageUrl[0], baseUrl),
    //                     type: 'image/png',
    //                 },
    //             ],
    //             title: currentTrack.name,
    //         });
    //     }

    //     return () => {
    //         navigator.mediaSession.setActionHandler('play', null);
    //         navigator.mediaSession.setActionHandler('pause', null);
    //         navigator.mediaSession.setActionHandler('previoustrack', null);
    //         navigator.mediaSession.setActionHandler('nexttrack', null);
    //         navigator.mediaSession.setActionHandler('stop', null);
    //     };
    // }, [currentTrack, player.volume]);

    return <AudiolingWebPlayer />;
}
