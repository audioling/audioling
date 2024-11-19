import { forwardRef } from 'react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import {
    LuAlertTriangle,
    LuArrowDown,
    LuArrowDownWideNarrow,
    LuArrowLeft,
    LuArrowLeftToLine,
    LuArrowRight,
    LuArrowRightToLine,
    LuArrowUp,
    LuArrowUpDown,
    LuArrowUpNarrowWide,
    LuCheck,
    LuCheckCircle,
    LuChevronDown,
    LuChevronLast,
    LuChevronLeft,
    LuChevronRight,
    LuChevronUp,
    LuDisc3,
    LuFlag,
    LuFolderOpen,
    LuHeart,
    LuHome,
    LuInfinity,
    LuInfo,
    LuLayoutGrid,
    LuLayoutList,
    LuLibrary,
    LuList,
    LuListMusic,
    LuListOrdered,
    LuLoader,
    LuLock,
    LuMenu,
    LuMinus,
    LuMoreHorizontal,
    LuMoreVertical,
    LuMusic2,
    LuPanelRightClose,
    LuPanelRightOpen,
    LuPause,
    LuPencilLine,
    LuPlay,
    LuPlus,
    LuRotateCw,
    LuSearch,
    LuShieldAlert,
    LuSkipBack,
    LuSkipForward,
    LuSquare,
    LuStepBack,
    LuStepForward,
    LuTrash,
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
    arrowLeft: LuArrowLeft,
    arrowLeftS: LuChevronLeft,
    arrowLeftToLine: LuArrowLeftToLine,
    arrowRight: LuArrowRight,
    arrowRightLast: LuChevronLast,
    arrowRightS: LuChevronRight,
    arrowRightToLine: LuArrowRightToLine,
    arrowUp: LuArrowUp,
    arrowUpS: LuChevronUp,
    check: LuCheck,
    delete: LuTrash,
    dropdown: LuChevronDown,
    edit: LuPencilLine,
    ellipsisHorizontal: LuMoreHorizontal,
    ellipsisVertical: LuMoreVertical,
    error: LuShieldAlert,
    favorite: LuHeart,
    folder: LuFolderOpen,
    genre: LuFlag,
    home: LuHome,
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
    mediaStepBackward: LuStepBack,
    mediaStepForward: LuStepForward,
    menu: LuMenu,
    panelRightClose: LuPanelRightClose,
    panelRightOpen: LuPanelRightOpen,
    playlist: LuListMusic,
    queue: LuList,
    refresh: LuRotateCw,
    remove: LuMinus,
    search: LuSearch,
    sort: LuArrowUpDown,
    sortAsc: LuArrowUpNarrowWide,
    sortDesc: LuArrowDownWideNarrow,
    spinner: LuLoader,
    square: LuSquare,
    success: LuCheckCircle,
    track: LuMusic2,
    visibility: MdOutlineVisibility,
    visibilityOff: MdOutlineVisibilityOff,
    volumeMax: LuVolume2,
    volumeMute: LuVolumeX,
    volumeNormal: LuVolume1,
    warn: LuAlertTriangle,
    x: MdClose,
} as const;

interface IconProps {
    fill?: boolean;
    icon: keyof typeof AppIcon;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
    state?: 'success' | 'error' | 'info' | 'warn';
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>((props, ref) => {
    const { fill, size, icon } = props;

    const classNames = clsx({
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
