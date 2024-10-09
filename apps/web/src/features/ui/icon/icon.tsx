import clsx from 'clsx';
import {
    MdArrowBack,
    MdArrowForward,
    MdCheck,
    MdClose,
    MdOutlineVisibility,
    MdOutlineVisibilityOff,
} from 'react-icons/md';
import {
    RiAddLine,
    RiBook2Line,
    RiDeleteBinLine,
    RiHome3Line,
    RiLoader3Line,
    RiLock2Line,
    RiMusic2Line,
    RiPlayList2Line,
    RiSearchLine,
    RiSubtractLine,
} from 'react-icons/ri';
import styles from './icon.module.scss';

export const AppIcon = {
    add: RiAddLine,
    arrowLeft: MdArrowBack,
    arrowRight: MdArrowForward,
    check: MdCheck,
    delete: RiDeleteBinLine,
    home: RiHome3Line,
    library: RiBook2Line,
    lock: RiLock2Line,
    playlists: RiPlayList2Line,
    queue: RiMusic2Line,
    remove: RiSubtractLine,
    search: RiSearchLine,
    spinner: RiLoader3Line,
    visibility: MdOutlineVisibility,
    visibilityOff: MdOutlineVisibilityOff,
    x: MdClose,
} as const;

interface IconProps {
    icon: keyof typeof AppIcon;
    size?: number;
    state?: 'success' | 'error' | 'info' | 'warn';
}

export const Icon = (props: IconProps) => {
    const { size, icon } = props;

    const classNames = clsx({
        [styles.icon]: true,
        [styles.colorDefault]: !props.state,
        [styles[`color-${props.state}`]]: props.state,
    });

    const IconComponent = AppIcon[icon];

    return (
        <span className={classNames}>
            <IconComponent size={size} />
        </span>
    );
};
