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
    RiAlertLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiBook2Line,
    RiCheckboxCircleLine,
    RiDeleteBinLine,
    RiEditLine,
    RiErrorWarningLine,
    RiHome3Line,
    RiInformationLine,
    RiLoader3Line,
    RiLock2Line,
    RiMenuLine,
    RiMusic2Line,
    RiPlayList2Line,
    RiSearchLine,
    RiSubtractLine,
} from 'react-icons/ri';
import styles from './icon.module.scss';

export const AppIcon = {
    add: RiAddLine,
    arrowLeft: MdArrowBack,
    arrowLeftS: RiArrowLeftSLine,
    arrowRight: MdArrowForward,
    arrowRightS: RiArrowRightSLine,
    check: MdCheck,
    delete: RiDeleteBinLine,
    edit: RiEditLine,
    error: RiErrorWarningLine,
    home: RiHome3Line,
    info: RiInformationLine,
    library: RiBook2Line,
    lock: RiLock2Line,
    menu: RiMenuLine,
    playlists: RiPlayList2Line,
    queue: RiMusic2Line,
    remove: RiSubtractLine,
    search: RiSearchLine,
    spinner: RiLoader3Line,
    sucess: RiCheckboxCircleLine,
    visibility: MdOutlineVisibility,
    visibilityOff: MdOutlineVisibilityOff,
    warn: RiAlertLine,
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
