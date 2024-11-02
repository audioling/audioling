import clsx from 'clsx';
import {
    LuAlertTriangle,
    LuArrowDownWideNarrow,
    LuArrowLeft,
    LuArrowRight,
    LuArrowUpDown,
    LuArrowUpNarrowWide,
    LuCheck,
    LuCheckCircle,
    LuChevronDown,
    LuChevronLeft,
    LuChevronRight,
    LuDisc3,
    LuFlag,
    LuHeart,
    LuHome,
    LuInfinity,
    LuInfo,
    LuLayoutGrid,
    LuLayoutList,
    LuLibrary,
    LuListMusic,
    LuListOrdered,
    LuLoader2,
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
    arrowLeft: LuArrowLeft,
    arrowLeftS: LuChevronLeft,
    arrowRight: LuArrowRight,
    arrowRightS: LuChevronRight,
    check: LuCheck,
    delete: LuTrash,
    dropdown: LuChevronDown,
    edit: LuPencilLine,
    error: LuShieldAlert,
    favorite: LuHeart,
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
    spinner: LuLoader2,
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

export const Icon = (props: IconProps) => {
    const { size, icon } = props;

    const classNames = clsx({
        [styles.icon]: true,
        [styles.colorDefault]: !props.state,
        [styles[`color-${props.state}`]]: props.state,
        [styles[`size-${size}`]]: typeof size === 'string',
    });

    const IconComponent = AppIcon[icon];

    return (
        <span className={classNames}>
            <IconComponent />
        </span>
    );
};
