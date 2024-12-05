import { forwardRef } from 'react';
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
    LuDisc3,
    LuEllipsis,
    LuEllipsisVertical,
    LuFileDown,
    LuFlag,
    LuFolderOpen,
    LuHardDriveDownload,
    LuHeart,
    LuHeartCrack,
    LuHouse,
    LuInfinity,
    LuInfo,
    LuLayoutGrid,
    LuLayoutList,
    LuLibrary,
    LuList,
    LuListMusic,
    LuListOrdered,
    LuListPlus,
    LuLoader,
    LuLock,
    LuMenu,
    LuMinus,
    LuMusic2,
    LuPanelRightClose,
    LuPanelRightOpen,
    LuPause,
    LuPencilLine,
    LuPlay,
    LuPlus,
    LuRotateCw,
    LuSearch,
    LuShare2,
    LuShieldAlert,
    LuShuffle,
    LuSkipBack,
    LuSkipForward,
    LuSlidersHorizontal,
    LuSquare,
    LuStar,
    LuStepBack,
    LuStepForward,
    LuTrash,
    LuTriangleAlert,
    LuVolume1,
    LuVolume2,
    LuVolumeX,
} from 'react-icons/lu';
import { MdClose, MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md';
import styles from './icon.module.scss';

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
    cache: LuHardDriveDownload,
    check: LuCheck,
    delete: LuTrash,
    download: LuFileDown,
    dropdown: LuChevronDown,
    edit: LuPencilLine,
    ellipsisHorizontal: LuEllipsis,
    ellipsisVertical: LuEllipsisVertical,
    error: LuShieldAlert,
    favorite: LuHeart,
    folder: LuFolderOpen,
    genre: LuFlag,
    home: LuHouse,
    info: LuInfo,
    layoutGrid: LuLayoutGrid,
    layoutTable: LuLayoutList,
    library: LuLibrary,
    listInfinite: LuInfinity,
    listPaginated: LuListOrdered,
    lock: LuLock,
    mediaNext: LuSkipForward,
    mediaPause: LuPause,
    mediaPlay: LuPlay,
    mediaPrevious: LuSkipBack,
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
    share: LuShare2,
    sort: LuArrowUpDown,
    sortAsc: LuArrowUpNarrowWide,
    sortDesc: LuArrowDownWideNarrow,
    spinner: LuLoader,
    square: LuSquare,
    star: LuStar,
    success: LuCircleCheck,
    track: LuMusic2,
    unfavorite: LuHeartCrack,
    visibility: MdOutlineVisibility,
    visibilityOff: MdOutlineVisibilityOff,
    volumeMax: LuVolume2,
    volumeMute: LuVolumeX,
    volumeNormal: LuVolume1,
    warn: LuTriangleAlert,
    x: MdClose,
} as const;

interface IconProps {
    className?: string;
    fill?: boolean;
    icon: keyof typeof AppIcon;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
    state?: 'success' | 'error' | 'info' | 'warn';
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>((props, ref) => {
    const { className, fill, size, icon } = props;

    const classNames = clsx(className, {
        [styles.icon]: true,
        [styles.iconFill]: fill,
        [styles.colorDefault]: !props.state,
        [styles[`color-${props.state}`]]: props.state,
        [styles[`size-${size}`]]: typeof size === 'string',
    });

    const IconComponent = AppIcon[icon];

    return (
        <span ref={ref} className={classNames}>
            <IconComponent />
        </span>
    );
});

Icon.displayName = 'Icon';

export const MotionIcon = motion.create(Icon);
