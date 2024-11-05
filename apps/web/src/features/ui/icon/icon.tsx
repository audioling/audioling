import { forwardRef } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import {
    LuAlertTriangle,
    LuArrowDown,
    LuArrowDownWideNarrow,
    LuArrowLeft,
    LuArrowRight,
    LuArrowUp,
    LuArrowUpDown,
    LuArrowUpNarrowWide,
    LuCheck,
    LuCheckCircle,
    LuChevronDown,
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
    LuListMusic,
    LuListOrdered,
    LuLoader,
    LuLock,
    LuMenu,
    LuMinus,
    LuMusic2,
    LuPencilLine,
    LuPlus,
    LuRotateCw,
    LuSearch,
    LuShieldAlert,
    LuTrash,
    LuVolume1,
    LuVolume2,
    LuVolumeX,
} from 'react-icons/lu';
import { MdClose, MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md';
import { RiMusic2Line, RiSidebarFoldFill } from 'react-icons/ri';
import styles from './icon.module.scss';

export const AppIcon = {
    add: LuPlus,
    album: LuDisc3,
    arrowDown: LuArrowDown,
    arrowDownS: LuChevronDown,
    arrowLeft: LuArrowLeft,
    arrowLeftS: LuChevronLeft,
    arrowRight: LuArrowRight,
    arrowRightS: LuChevronRight,
    arrowUp: LuArrowUp,
    arrowUpS: LuChevronUp,
    check: LuCheck,
    delete: LuTrash,
    dropdown: LuChevronDown,
    edit: LuPencilLine,
    error: LuShieldAlert,
    favorite: LuHeart,
    folder: LuFolderOpen,
    genre: LuFlag,
    home: LuHome,
    info: LuInfo,
    layoutGrid: LuLayoutGrid,
    layoutList: LuLayoutList,
    library: LuLibrary,
    listInfinite: LuInfinity,
    listPaginated: LuListOrdered,
    lock: LuLock,
    menu: LuMenu,
    playlist: LuListMusic,
    queue: RiMusic2Line,
    queueSide: RiSidebarFoldFill,
    refresh: LuRotateCw,
    remove: LuMinus,
    search: LuSearch,
    sort: LuArrowUpDown,
    sortAsc: LuArrowUpNarrowWide,
    sortDesc: LuArrowDownWideNarrow,
    spinner: LuLoader,
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
    icon: keyof typeof AppIcon;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
    state?: 'success' | 'error' | 'info' | 'warn';
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>((props, ref) => {
    const { size, icon } = props;

    const classNames = clsx({
        [styles.icon]: true,
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
