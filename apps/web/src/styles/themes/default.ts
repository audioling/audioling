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

const secondaryColors: MantineColorsTuple = [
    '#f6efff',
    '#e6ddf4',
    '#c8bae2',
    '#aa94d0',
    '#9073c1',
    '#7f5fb8',
    '#7754b4',
    '#66459f',
    '#5a3d8f',
    '#4e337f',
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
    app: {
        'global-bg-dark': '#090909',
        'global-bg-light': '#ffffff',
        'global-fg-dark': '#e6e6e6',
        'global-fg-light': '#0d0d0f',
        'global-primary-color-contrast': '#0d0d0f',
        'global-scrollbar-size': '6px',
        'global-scrollbar-thumb-active-background-color': 'rgba(255, 255, 255, 0.4)',
        'global-scrollbar-thumb-background-color': 'rgba(255, 255, 255, 0.1)',
        'global-scrollbar-thumb-border-radius': '0px',
        'global-scrollbar-thumb-hover-background-color': 'rgba(255, 255, 255, 0.4)',
        'global-scrollbar-track-background-color': 'transparent',
        'global-scrollbar-track-border-radius': '6px',
        'global-scrollbar-track-hover-background-color': 'transparent',

    },
    mantineOverride: {
        colors: {
            dark: darkColors,
            primary: primaryColors,
            secondary: secondaryColors,
        },
        defaultRadius: 'sm',
        focusRing: 'never',
        fontFamily: 'Inter, Noto Sans JP',
        fontFamilyMonospace: 'Inter',
        primaryShade: {
            dark: 1,
            light: 1,
        },
    },
};
