import type { AppTheme } from '/@/styles/theme-types';
import type { MantineColorsTuple } from '@mantine/core';

const primaryColors: MantineColorsTuple = [
    '#f5f5f5',
    '#e7e7e7',
    '#cdcdcd',
    '#b2b2b2',
    '#9a9a9a',
    '#8b8b8b',
    '#848484',
    '#717171',
    '#242424',
    '#141414',
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

export const defaultTheme: AppTheme = {
    mantineOverride: {
        colors: {
            dark: darkColors,
            primary: primaryColors,
            secondary: primaryColors,
        },
        defaultRadius: 'md',
        focusRing: 'auto',
        fontFamily: 'Poppins',
        fontFamilyMonospace: 'Inter',
        primaryShade: {
            dark: 1,
            light: 9,
        },
    },
    textDark: '#f9f9f9',
    textLight: '#030303',
};
