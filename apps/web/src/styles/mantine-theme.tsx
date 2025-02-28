import type {
    MantineColorsTuple,
    MantineThemeOverride,
} from '@mantine/core';
import type { AppTheme } from './theme-types';
import {
    createTheme,
    rem,
} from '@mantine/core';
import merge from 'lodash/merge';
import { AnchorComponentOverride } from '/@/components/anchor/anchor';
import { BadgeComponentOverride } from '/@/components/badge/badge';
import { ButtonComponentOverride } from '/@/components/button/button';
import { CardComponentOverride } from '/@/components/card/card';
import { CheckboxComponentOverride } from '/@/components/checkbox/checkbox';
import { ChipComponentOverride } from '/@/components/chip/chip';
import { ContainerComponentOverride } from '/@/components/container/container';
import { IndicatorComponentOverride } from '/@/components/indicator/indicator';
import { MarkComponentOverride } from '/@/components/mark/mark';
import { NavLinkComponentOverride } from '/@/components/nav-link/nav-link';
import { NumberInputComponentOverride } from '/@/components/number-input/number-input';
import { PaginationComponentOverride } from '/@/components/pagination/pagination';
import { PaperComponentOverride } from '/@/components/paper/paper';
import { PasswordInputComponentOverride } from '/@/components/password-input/password-input';
import { RadioComponentOverride } from '/@/components/radio/radio';
import { SegmentedControlComponentOverride } from '/@/components/segmented-control/segmented-control';
import { SelectComponentOverride } from '/@/components/select/select';
import { SwitchComponentOverride } from '/@/components/switch/switch';
import { TextInputComponentOverride } from '/@/components/text-input/text-input';
import { TextComponentOverride } from '/@/components/text/text';
import { TooltipComponentOverride } from '/@/components/tooltip/tooltip';

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
        Anchor: AnchorComponentOverride,
        Badge: BadgeComponentOverride,
        Button: ButtonComponentOverride,
        Card: CardComponentOverride,
        Checkbox: CheckboxComponentOverride,
        Chip: ChipComponentOverride,
        Container: ContainerComponentOverride,
        Indicator: IndicatorComponentOverride,
        Mark: MarkComponentOverride,
        NavLink: NavLinkComponentOverride,
        NumberInput: NumberInputComponentOverride,
        Pagination: PaginationComponentOverride,
        Paper: PaperComponentOverride,
        PasswordInput: PasswordInputComponentOverride,
        Radio: RadioComponentOverride,
        SegmentedControl: SegmentedControlComponentOverride,
        Select: SelectComponentOverride,
        Switch: SwitchComponentOverride,
        Text: TextComponentOverride,
        TextInput: TextInputComponentOverride,
        Tooltip: TooltipComponentOverride,
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
