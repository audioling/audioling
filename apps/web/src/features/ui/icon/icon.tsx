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
    RiHeartFill,
    RiHome3Line,
    RiInformationLine,
    RiLoader3Line,
    RiLock2Line,
    RiMenuLine,
    RiMusic2Line,
    RiMusicLine,
    RiPlayList2Line,
    RiSearchLine,
    RiSidebarFoldFill,
    RiSubtractLine,
    RiVolumeDownFill,
    RiVolumeMuteFill,
    RiVolumeUpFill,
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
    favorite: RiHeartFill,
    genre: RiFlag2Line,
    home: RiHome3Line,
    info: RiInformationLine,
    library: RiBook2Line,
    lock: RiLock2Line,
    menu: RiMenuLine,
    playlist: RiPlayList2Line,
    queue: RiMusic2Line,
    queueSide: RiSidebarFoldFill,
    remove: RiSubtractLine,
    search: RiSearchLine,
    spinner: RiLoader3Line,
    sucess: RiCheckboxCircleLine,
    track: RiMusicLine,
    visibility: MdOutlineVisibility,
    visibilityOff: MdOutlineVisibilityOff,
    volumeMax: RiVolumeUpFill,
    volumeMute: RiVolumeMuteFill,
    volumeNormal: RiVolumeDownFill,
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
            <IconComponent />
        </span>
    );
};
