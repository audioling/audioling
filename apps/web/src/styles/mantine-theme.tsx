/* eslint-disable style/max-len */

import type {
    MantineColorsTuple,
    MantineThemeOverride,
} from '@mantine/core';
import type { AppTheme } from './theme-types';
import {
    ActionIcon,
    Alert,
    alpha,
    Anchor,
    Avatar,
    Badge,
    Blockquote,
    Button,
    Card,
    Checkbox,
    Chip,
    Container,
    createTheme,
    Dialog,
    Indicator,
    Mark,
    NavLink,
    NumberInput,
    Pagination,
    Paper,
    PasswordInput,
    Radio,
    rem,
    SegmentedControl,
    Select,
    Stepper,
    Switch,
    TextInput,
    ThemeIcon,
    Timeline,
    Tooltip,
} from '@mantine/core';
import merge from 'lodash/merge';
import { Icon } from '/@/components/icon/icon';

const CONTAINER_SIZES: Record<string, string> = {
    lg: rem('600px'),
    md: rem('500px'),
    sm: rem('400px'),
    xl: rem('1400px'),
    xs: rem('300px'),
    xxl: rem('1600px'),
    xxs: rem('200px'),
};

const primaryColors: MantineColorsTuple = [
    '#f5f5f5',
    '#e7e7e7',
    '#cdcdcd',
    '#b2b2b2',
    '#9a9a9a',
    '#8b8b8b',
    '#848484',
    '#717171',
    '#656565',
    '#575757',
];

const darkColors: MantineColorsTuple = [
    '#C9C9C9',
    '#b8b8b8',
    '#828282',
    '#696969',
    '#424242',
    '#3b3b3b',
    '#242424',
    '#181818',
    '#1f1f21',
    '#141414',
];

const mantineTheme: MantineThemeOverride = createTheme({
    autoContrast: true,
    breakpoints: {
        lg: '75em',
        md: '62em',
        sm: '48em',
        xl: '88em',
        xs: '36em',
    },
    colors: {
        dark: darkColors,
        primary: primaryColors,
    },
    components: {
        ActionIcon: ActionIcon.extend({
            vars: (theme, props) => {
                const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
                const variant = props.variant ?? 'filled';

                return {
                    root: {
                        '--ai-color': (() => {
                            if (variant === 'filled') {
                                if (colorKey) {
                                    return `var(--mantine-color-${colorKey}-contrast)`;
                                }
                                return 'var(--mantine-primary-color-contrast)';
                            }
                            if (variant === 'white') {
                                return 'var(--mantine-color-black)';
                            }
                            return undefined;
                        })(),
                    },
                };
            },
        }),
        Alert: Alert.extend({
            vars: (theme, props) => {
                const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
                const variant = props.variant ?? 'light';
                return {
                    root: {
                        '--alert-color':
                variant === 'filled'
                    ? colorKey
                        ? `var(--mantine-color-${colorKey}-contrast)`
                        : 'var(--mantine-primary-color-contrast)'
                    : variant === 'white'
                        ? `var(--mantine-color-black)`
                        : undefined,
                    },
                };
            },
        }),
        Anchor: Anchor.extend({
            defaultProps: {
                underline: 'always',
            },
        }),
        Avatar: Avatar.extend({
            vars: (theme, props) => {
                const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
                const variant = props.variant ?? 'light';
                return {
                    root: {

                        '--avatar-bd':
                variant === 'outline'
                    ? colorKey
                        ? `1px solid var(--mantine-color-${colorKey}-outline)`
                        : '1px solid var(--mantine-primary-color-filled)'
                    : undefined,
                        '--avatar-bg':
                variant === 'filled'
                    ? colorKey
                        ? `var(--mantine-color-${colorKey}-filled)`
                        : 'var(--mantine-primary-color-filled)'
                    : variant === 'light'
                        ? colorKey
                            ? `var(--mantine-color-${colorKey}-light)`
                            : 'var(--mantine-primary-color-light)'
                        : undefined,

                        '--avatar-color':
                variant === 'filled'
                    ? colorKey
                        ? `var(--mantine-color-${colorKey}-contrast)`
                        : 'var(--mantine-primary-color-contrast)'
                    : variant === 'light'
                        ? colorKey
                            ? `var(--mantine-color-${colorKey}-light-color)`
                            : 'var(--mantine-primary-color-light-color)'
                        : variant === 'white'
                            ? colorKey
                                ? `var(--mantine-color-${colorKey}-outline)`
                                : 'var(--mantine-primary-color-filled)'
                            : variant === 'outline' || variant === 'transparent'
                                ? colorKey
                                    ? `var(--mantine-color-${colorKey}-outline)`
                                    : 'var(--mantine-primary-color-filled)'
                                : undefined,
                    },
                };
            },
        }),
        Badge: Badge.extend({
            vars: (theme, props) => {
                const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
                const variant = props.variant ?? 'filled';
                return {
                    root: {
                        '--badge-bg': variant === 'filled' && colorKey ? `var(--mantine-color-${colorKey}-filled)` : undefined,
                        '--badge-color':
                variant === 'filled'
                    ? (colorKey ? `var(--mantine-color-${colorKey}-contrast)` : 'var(--mantine-primary-color-contrast)')
                    : undefined,
                    },
                };
            },
        }),
        Blockquote: Blockquote.extend({
            vars: (theme, props) => {
                const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
                return {
                    root: {
                        '--bq-bg-dark': colorKey ? `var(--mantine-color-${colorKey}-light)` : 'var(--mantine-primary-color-light)',
                        '--bq-bg-light': colorKey ? `var(--mantine-color-${colorKey}-light)` : 'var(--mantine-primary-color-light)',
                    },
                };
            },
        }),
        Button: Button.extend({
            vars: (theme, props) => {
                const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
                const variant = props.variant ?? 'filled';
                return {
                    root: {
                        '--button-color': (() => {
                            if (variant === 'filled') {
                                if (colorKey) {
                                    return `var(--mantine-color-${colorKey}-contrast)`;
                                }
                                return 'var(--mantine-primary-color-contrast)';
                            }
                            if (variant === 'white') {
                                return undefined;
                            }
                            return undefined;
                        })(),
                    },
                };
            },
        }),
        Card: Card.extend({
            defaultProps: {
                p: 'xl',
                shadow: 'xl',
                withBorder: true,
            },
            styles: (theme) => {
                return {
                    root: {
                        backgroundColor:
                theme.primaryColor === 'rose' || theme.primaryColor === 'green'
                    ? 'var(--mantine-color-secondary-filled)'
                    : undefined,
                    },
                };
            },
        }),
        Checkbox: Checkbox.extend({
            vars: (theme, props) => {
                const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
                return {
                    root: {
                        '--checkbox-color': colorKey ? `var(--mantine-color-${colorKey}-filled)` : 'var(--mantine-primary-color-filled)',

                        '--checkbox-icon-color': colorKey ? `var(--mantine-color-${colorKey}-contrast)` : 'var(--mantine-primary-color-contrast)',
                    },
                };
            },
        }),
        Chip: Chip.extend({
            vars: (theme, props) => {
                const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
                const variant = props.variant ?? 'filled';
                return {
                    root: {
                        '--chip-bg':
                variant !== 'light'
                    ? colorKey
                        ? `var(--mantine-color-${colorKey}-filled)`
                        : 'var(--mantine-primary-color-filled)'
                    : undefined,
                        '--chip-color':
                variant === 'filled'
                    ? colorKey
                        ? `var(--mantine-color-${colorKey}-contrast)`
                        : 'var(--mantine-primary-color-contrast)'
                    : undefined,
                    },
                };
            },
        }),
        Container: Container.extend({
            vars: (_, { fluid, size }) => ({
                root: {
                    '--container-size': fluid
                        ? '100%'
                        : size !== undefined && size in CONTAINER_SIZES
                            ? CONTAINER_SIZES[size]
                            : rem(size),
                },
            }),
        }),
        Dialog: Dialog.extend({
            defaultProps: {
                withBorder: true,
            },
        }),
        Indicator: Indicator.extend({
            vars: (theme, props) => {
                const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
                return {
                    root: {
                        '--indicator-text-color': colorKey
                            ? `var(--mantine-color-${colorKey}-contrast)`
                            : 'var(--mantine-primary-color-contrast)',
                    },
                };
            },
        }),
        Mark: Mark.extend({
            vars: (theme, props) => {
                const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : 'yellow';
                return {
                    root: {
                        '--mark-bg-dark': `var(--mantine-color-${colorKey}-filled)`,
                        '--mark-bg-light': `var(--mantine-color-${colorKey}-filled-hover)`,
                    },
                };
            },
        }),
        NavLink: NavLink.extend({
            vars: (theme, props) => {
                const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
                const variant = props.variant ?? 'light';
                return {
                    children: {},
                    root: {
                        '--nl-color':
                variant === 'filled' ? colorKey ? `var(--mantine-color-${colorKey}-contrast)` : 'var(--mantine-primary-color-contrast)' : undefined,
                    },
                };
            },
        }),
        NumberInput: NumberInput.extend({
            defaultProps: {
                variant: 'filled',
            },
            styles: () => ({
                input: {
                    fontSize: 'var(--mantine-font-size-md)',
                    height: 40,
                },
                label: {
                    fontSize: 'var(--mantine-font-size-md)',
                    paddingBottom: 'var(--mantine-spacing-xs)',
                },
            }),
            vars: (_theme, props) => {
                return {
                    controls: {},
                    wrapper: {
                        '--input-bg': props.variant === 'filled' ? `var(--mantine-color-default)` : 'transparent',
                    },
                };
            },
        }),
        Pagination: Pagination.extend({
            vars: (theme, props) => {
                const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
                return {
                    root: {
                        '--pagination-active-color': colorKey
                            ? `var(--mantine-color-${colorKey}-contrast)`
                            : 'var(--mantine-primary-color-contrast)',
                    },
                };
            },
        }),
        Paper: Paper.extend({
            defaultProps: {
                shadow: 'xl',
            },
            styles: () => {
                return {
                    root: {
                        backgroundColor: alpha('var(--mantine-color-default)', 0.135),
                    },
                };
            },
        }),
        PasswordInput: PasswordInput.extend({
            defaultProps: {
                variant: 'filled',
                visibilityToggleIcon: ({ reveal }) => <Icon icon={reveal ? 'visibilityOff' : 'visibility'} />,
            },
            styles: () => ({
                input: {
                    height: 40,
                },
                label: {
                    fontSize: 'var(--mantine-font-size-md)',
                    paddingBottom: 'var(--mantine-spacing-xs)',
                },
            }),
            vars: (_theme, props) => {
                return {
                    root: {},
                    wrapper: {
                        '--input-bg': props.variant === 'filled' ? `var(--mantine-color-default)` : 'transparent',
                    },
                };
            },
        }),
        Radio: Radio.extend({
            vars: (theme, props) => ({
                root: {
                    '--radio-color': props.color
                        ? Object.keys(theme.colors).includes(props.color)
                            ? `var(--mantine-color-${props.color}-filled)`
                            : props.color
                        : 'var(--mantine-primary-color-filled)',

                    '--radio-icon-color': props.color
                        ? Object.keys(theme.colors).includes(props.color)
                            ? `var(--mantine-color-${props.color}-contrast)`
                            : props.color
                        : 'var(--mantine-primary-color-contrast)',
                },
            }),
        }),
        SegmentedControl: SegmentedControl.extend({
            styles: (_theme, props) => ({
                root: {
                    backgroundColor: props.variant === 'filled' ? 'var(--mantine-color-default)' : 'transparent',
                },
            }),
            vars: () => ({
                root: {
                    '--sc-color': 'var(--mantine-color-default-hover)',
                },
            }),
        }),
        Select: Select.extend({
            defaultProps: {
                checkIconPosition: 'right',
            },
        }),
        Stepper: Stepper.extend({
            vars: (theme, props) => {
                const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
                return {
                    root: {
                        '--stepper-icon-color': colorKey
                            ? `var(--mantine-color-${colorKey}-contrast)`
                            : 'var(--mantine-primary-color-contrast)',
                    },
                };
            },
        }),
        Switch: Switch.extend({
            styles: () => ({
                thumb: {
                    backgroundColor: 'var(--mantine-color-default)',
                    borderColor: 'var(--mantine-color-default-border)',
                },
                track: {
                    borderColor: 'var(--mantine-color-default-border)',
                },
            }),
        }),
        TextInput: TextInput.extend({
            defaultProps: {
                variant: 'filled',
            },
            styles: () => ({
                label: {
                    fontSize: 'var(--mantine-font-size-md)',
                    paddingBottom: 'var(--mantine-spacing-xs)',
                },
            }),
            vars: (_theme, props) => {
                return {
                    wrapper: {
                        '--input-bg': props.variant === 'filled' ? `var(--mantine-color-default)` : 'transparent',
                    },
                };
            },
        }),
        ThemeIcon: ThemeIcon.extend({
            vars: (theme, props) => {
                const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
                const isNeutralColor = colorKey && ['zinc', 'slate', 'gray', 'neutral', 'stone'].includes(colorKey);
                const isNeutralPrimaryColor = !colorKey && ['zinc', 'slate', 'gray', 'neutral', 'stone'].includes(theme.primaryColor);

                const variant = props.variant ?? 'filled';
                return {
                    root: {
                        '--ti-color': variant === 'filled'
                            ? (colorKey
                                    ? `var(--mantine-color-${colorKey}-contrast)`
                                    : 'var(--mantine-primary-color-contrast)')
                            : variant === 'white'
                                ? (isNeutralColor || isNeutralPrimaryColor
                                        ? `var(--mantine-color-black)`
                                        : undefined)
                                : undefined,
                    },
                };
            },
        }),
        Timeline: Timeline.extend({
            vars: (theme, props) => {
                const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
                return {
                    root: {
                        '--tl-icon-color': colorKey ? `var(--mantine-color-${colorKey}-contrast)` : 'var(--mantine-primary-color-contrast)',
                    },
                };
            },
        }),
        Tooltip: Tooltip.extend({
            vars: () => ({
                tooltip: {
                    '--tooltip-bg': 'var(--mantine-color-primary-color-filled)',
                    '--tooltip-color': 'var(--mantine-color-primary-color-contrast)',
                },
            }),
        }),
    },
    cursorType: 'pointer',
    defaultRadius: 'md',
    focusRing: 'auto',
    fontFamily: 'Poppins',
    fontSizes: {
        '2xl': rem('24px'),
        '3xl': rem('28px'),
        '4xl': rem('32px'),
        '5xl': rem('40px'),
        'lg': rem('16px'),
        'md': rem('12px'),
        'sm': rem('11px'),
        'xl': rem('20px'),
        'xs': rem('10px'),
    },
    headings: {
        fontFamily: 'Poppins',
        sizes: {
            h1: {
                fontSize: rem('36px'),
                fontWeight: '600',
                lineHeight: rem('44px'),
            },
            h2: {
                fontSize: rem('30px'),
                fontWeight: '600',
                lineHeight: rem('38px'),
            },
            h3: {
                fontSize: rem('24px'),
                fontWeight: '600',
                lineHeight: rem('32px'),
            },
            h4: {
                fontSize: rem('20px'),
                fontWeight: '600',
                lineHeight: rem('30px'),
            },
        },
    },
    lineHeights: {
        lg: rem('24px'),
        md: rem('20px'),
        sm: rem('18px'),
        xs: rem('16px'),
    },
    luminanceThreshold: 0.3,
    primaryColor: 'primary',
    primaryShade: { dark: 0, light: 9 },
    radius: {
        lg: rem('12px'),
        md: rem('5px'),
        sm: rem('3px'),
        xl: rem('16px'),
        xs: rem('3px'),
    },
    scale: 1,
    shadows: {
        lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
        xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
        xxl: '0 25px 50px rgba(0, 0, 0, 0.25)',
    },
    spacing: {
        '2xl': rem('28px'),
        '2xs': rem('8px'),
        '3xl': rem('32px'),
        '3xs': rem('4px'),
        '4xl': rem('40px'),
        '4xs': rem('2px'),
        'lg': rem('20px'),
        'md': rem('16px'),
        'sm': rem('12px'),
        'xl': rem('24px'),
        'xs': rem('6px'),
    },
});

export function createAppTheme(theme: AppTheme): MantineThemeOverride {
    const mergedTheme: MantineThemeOverride = merge(mantineTheme, theme.mantineOverride);
    return createTheme(mergedTheme);
}
