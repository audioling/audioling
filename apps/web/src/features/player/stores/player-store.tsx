// import { create } from 'zustand';
// import { devtools } from 'zustand/middleware';
// import { immer } from 'zustand/middleware/immer';
// import type { TrackItem } from '@/api/api-types.ts';

// export interface PlayerTrack extends TrackItem {
//     uniqueId: string;
// }

// export enum PlayerStatus {
//     PAUSED = 'paused',
//     PLAYING = 'playing',
// }

// export enum PlayerRepeat {
//     ALBUM = 'album',
//     ALL = 'all',
//     OFF = 'off',
//     ONE = 'one',
// }

// export enum PlayerShuffle {
//     ALBUM = 'album',
//     ALL = 'all',
//     OFF = 'off',
//     TRACK = 'track',
// }

// export interface PlayerState {
//     current: {
//         index: number;
//         nextIndex: number;
//         player: 1 | 2;
//         previousIndex: number;
//         seek: boolean;
//         shuffledIndex: number;
//         song?: PlayerTrack;
//         status: PlayerStatus;
//         time: number;
//     };
//     fallback: boolean | null;
//     muted: boolean;
//     queue: {
//         default: PlayerTrack[];
//         previousNode?: PlayerTrack;
//         shuffled: string[];
//         sorted: PlayerTrack[];
//     };
//     repeat: PlayerRepeat;
//     shuffle: PlayerShuffle;
//     speed: number;
//     volume: number;
// }

// export interface PlayerData {
//     current: {
//         index: number;
//         nextIndex?: number;
//         player: 1 | 2;
//         previousIndex?: number;
//         shuffledIndex: number;
//         song?: PlayerTrack;
//         status: PlayerStatus;
//     };
//     player1?: PlayerTrack;
//     player2?: PlayerTrack;
//     queue: QueueData;
// }

// export interface QueueData {
//     current?: PlayerTrack;
//     length: number;
//     next?: PlayerTrack;
//     previous?: PlayerTrack;
// }

// export interface PlayerSlice extends PlayerState {
//     actions: {
//         addToQueue: (args: {
//             initialIndex: number;
//             playType: Play;
//             songs: PlayerTrack[];
//         }) => PlayerData;
//         autoNext: () => PlayerData;
//         checkIsFirstTrack: () => boolean;
//         checkIsLastTrack: (type?: 'next' | 'prev') => boolean;
//         clearQueue: () => PlayerData;
//         getPlayerData: () => PlayerData;
//         getQueueData: () => QueueData;
//         incrementPlayCount: (ids: string[]) => string[];
//         moveToBottomOfQueue: (uniqueIds: string[]) => PlayerData;
//         moveToNextOfQueue: (uniqueIds: string[]) => PlayerData;
//         moveToTopOfQueue: (uniqueIds: string[]) => PlayerData;
//         next: () => PlayerData;
//         pause: () => void;
//         play: () => void;
//         player1: () => PlayerTrack | undefined;
//         player2: () => PlayerTrack | undefined;
//         previous: () => PlayerData;
//         removeFromQueue: (uniqueIds: string[]) => PlayerData;
//         reorderQueue: (rowUniqueIds: string[], afterUniqueId?: string) => PlayerData;
//         restoreQueue: (data: Partial<PlayerState>) => PlayerData;
//         setCurrentIndex: (index: number) => PlayerData;
//         setCurrentSpeed: (speed: number) => void;
//         setCurrentTime: (time: number, seek?: boolean) => void;
//         setCurrentTrack: (uniqueId: string) => PlayerData;
//         setFallback: (fallback: boolean | null) => boolean;
//         setFavorite: (ids: string[], favorite: boolean) => string[];
//         setMuted: (muted: boolean) => void;
//         setRating: (ids: string[], rating: number | null) => string[];
//         setRepeat: (type: PlayerRepeat) => PlayerData;
//         setShuffle: (type: PlayerShuffle) => PlayerData;
//         setShuffledIndex: (index: number) => PlayerData;
//         setStore: (data: Partial<PlayerState>) => void;
//         setVolume: (volume: number) => void;
//         shuffleQueue: () => PlayerData;
//     };
// }

// export const usePlayerStore = create<PlayerSlice>()(devtools(immer()));
