import type { ComponentType } from 'react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import {
    LuArrowDown,
    LuArrowDownToLine,
    LuArrowDownWideNarrow,
    LuArrowLeft,
    LuArrowLeftToLine,
    LuArrowRight,
    LuArrowRightToLine,
    LuArrowUp,
    LuArrowUpDown,
    LuArrowUpNarrowWide,
    LuArrowUpToLine,
    LuBookOpen,
    LuCheck,
    LuChevronDown,
    LuChevronLast,
    LuChevronLeft,
    LuChevronRight,
    LuChevronUp,
    LuCircleCheck,
    LuCircleX,
    LuClock3,
    LuCloudDownload,
    LuDisc3,
    LuDownload,
    LuEllipsis,
    LuEllipsisVertical,
    LuFlag,
    LuFolderOpen,
    LuGripHorizontal,
    LuGripVertical,
    LuHash,
    LuHeart,
    LuHeartCrack,
    LuImage,
    LuImageOff,
    LuInfinity,
    LuInfo,
    LuLayoutGrid,
    LuLibrary,
    LuList,
    LuListMusic,
    LuListPlus,
    LuLoader,
    LuLock,
    LuLogIn,
    LuLogOut,
    LuMenu,
    LuMinus,
    LuMusic2,
    LuPanelRightClose,
    LuPanelRightOpen,
    LuPause,
    LuPencilLine,
    LuPlay,
    LuPlus,
    LuRepeat,
    LuRepeat1,
    LuRotateCw,
    LuSearch,
    LuSettings2,
    LuShare2,
    LuShieldAlert,
    LuShuffle,
    LuSkipBack,
    LuSkipForward,
    LuSlidersHorizontal,
    LuSquare,
    LuSquareMenu,
    LuStar,
    LuStepBack,
    LuStepForward,
    LuTable,
    LuTrash,
    LuTriangleAlert,
    LuUser,
    LuUserPen,
    LuUserRoundCog,
    LuVolume1,
    LuVolume2,
    LuVolumeX,
    LuX,
} from 'react-icons/lu';
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md';
import styles from './icon.module.css';

export type AppIconSelection = keyof typeof AppIcon;

export const AppIcon = {
    add: LuPlus,
    album: LuDisc3,
    arrowDown: LuArrowDown,
    arrowDownS: LuChevronDown,
    arrowDownToLine: LuArrowDownToLine,
    arrowLeft: LuArrowLeft,
    arrowLeftS: LuChevronLeft,
    arrowLeftToLine: LuArrowLeftToLine,
    arrowRight: LuArrowRight,
    arrowRightLast: LuChevronLast,
    arrowRightS: LuChevronRight,
    arrowRightToLine: LuArrowRightToLine,
    arrowUp: LuArrowUp,
    arrowUpS: LuChevronUp,
    arrowUpToLine: LuArrowUpToLine,
    artist: LuUserPen,
    cache: LuCloudDownload,
    check: LuCheck,
    delete: LuTrash,
    download: LuDownload,
    dragHorizontal: LuGripHorizontal,
    dragVertical: LuGripVertical,
    dropdown: LuChevronDown,
    duration: LuClock3,
    edit: LuPencilLine,
    ellipsisHorizontal: LuEllipsis,
    ellipsisVertical: LuEllipsisVertical,
    emptyImage: LuImageOff,
    error: LuShieldAlert,
    favorite: LuHeart,
    folder: LuFolderOpen,
    genre: LuFlag,
    hash: LuHash,
    home: LuSquareMenu,
    image: LuImage,
    info: LuInfo,
    layoutGrid: LuLayoutGrid,
    layoutTable: LuTable,
    library: LuLibrary,
    listInfinite: LuInfinity,
    listPaginated: LuArrowRightToLine,
    lock: LuLock,
    mediaNext: LuSkipForward,
    mediaPause: LuPause,
    mediaPlay: LuPlay,
    mediaPrevious: LuSkipBack,
    mediaRepeat: LuRepeat,
    mediaRepeatOne: LuRepeat1,
    mediaSettings: LuSlidersHorizontal,
    mediaShuffle: LuShuffle,
    mediaStepBackward: LuStepBack,
    mediaStepForward: LuStepForward,
    menu: LuMenu,
    metadata: LuBookOpen,
    panelRightClose: LuPanelRightClose,
    panelRightOpen: LuPanelRightOpen,
    playlist: LuListMusic,
    playlistAdd: LuListPlus,
    queue: LuList,
    refresh: LuRotateCw,
    remove: LuMinus,
    search: LuSearch,
    settings: LuSettings2,
    share: LuShare2,
    signIn: LuLogIn,
    signOut: LuLogOut,
    sort: LuArrowUpDown,
    sortAsc: LuArrowUpNarrowWide,
    sortDesc: LuArrowDownWideNarrow,
    spinner: LuLoader,
    square: LuSquare,
    star: LuStar,
    success: LuCircleCheck,
    track: LuMusic2,
    unfavorite: LuHeartCrack,
    user: LuUser,
    userManage: LuUserRoundCog,
    visibility: MdOutlineVisibility,
    visibilityOff: MdOutlineVisibilityOff,
    volumeMax: LuVolume2,
    volumeMute: LuVolumeX,
    volumeNormal: LuVolume1,
    warn: LuTriangleAlert,
    x: LuX,
    xCircle: LuCircleX,
} as const;

export interface IconProps {
    animate?: 'spin' | 'pulse';
    className?: string;
    fill?: 'success' | 'error' | 'info' | 'warn' | 'secondary' | 'primary' | 'inherit';
    icon: keyof typeof AppIcon;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
}

export function Icon(props: IconProps) {
    const { animate, className, fill, icon, size = 'md' } = props;

    const IconComponent = AppIcon[icon];

    const classNames = clsx(className, {
        [styles.fill]: true,
        [styles.spin]: animate === 'spin',
        [styles.pulse]: animate === 'pulse',
        [styles.fillInherit]: fill === 'inherit',
        [styles.fillSuccess]: fill === 'success',
        [styles.fillError]: fill === 'error',
        [styles.fillInfo]: fill === 'info',
        [styles.fillWarn]: fill === 'warn',
        [styles.fillSecondary]: fill === 'secondary',
        [styles.fillPrimary]: fill === 'primary',
    });

    return <IconComponent className={classNames} fill={fill} size={convertSizeToNumber(size)} />;
}

Icon.displayName = 'Icon';

export const MotionIcon: ComponentType = motion.create(Icon);

function convertSizeToNumber(size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string) {
    if (typeof size === 'number') {
        return size;
    }

    switch (size) {
        case 'xs':
            return 10;
        case 'sm':
            return 12;
        case 'md':
            return 16;
        case 'lg':
            return 24;
        case 'xl':
            return 32;
        default:
            return size;
    }
}
