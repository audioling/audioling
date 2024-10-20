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
    RiAlbumLine,
    RiAlertLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiBook2Line,
    RiCheckboxCircleLine,
    RiDeleteBinLine,
    RiEditLine,
    RiErrorWarningLine,
    RiFlag2Line,
    RiHome3Line,
    RiInformationLine,
    RiLoader3Line,
    RiLock2Line,
    RiMenuLine,
    RiMusic2Line,
    RiMusicLine,
    RiPlayList2Line,
    RiSearchLine,
    RiSubtractLine,
} from 'react-icons/ri';
import styles from './icon.module.scss';

export const AppIcon = {
    add: RiAddLine,
    album: RiAlbumLine,
    arrowLeft: MdArrowBack,
    arrowLeftS: RiArrowLeftSLine,
    arrowRight: MdArrowForward,
    arrowRightS: RiArrowRightSLine,
    check: MdCheck,
    delete: RiDeleteBinLine,
    edit: RiEditLine,
    error: RiErrorWarningLine,
    genre: RiFlag2Line,
    home: RiHome3Line,
    info: RiInformationLine,
    library: RiBook2Line,
    lock: RiLock2Line,
    menu: RiMenuLine,
    playlist: RiPlayList2Line,
    queue: RiMusic2Line,
    remove: RiSubtractLine,
    search: RiSearchLine,
    spinner: RiLoader3Line,
    sucess: RiCheckboxCircleLine,
    track: RiMusicLine,
    visibility: MdOutlineVisibility,
    visibilityOff: MdOutlineVisibilityOff,
    warn: RiAlertLine,
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
            <IconComponent size={size} />
        </span>
    );
};
