import type { MantineColorsTuple, MantineThemeOverride } from '@mantine/core';

export interface AppTheme {
    app: {
        'global-bg-dark': string;
        'global-bg-light': string;
        'global-fg-dark': string;
        'global-fg-light': string;
        'global-primary-color-contrast': string;
        'global-scrollbar-size': string;
        'global-scrollbar-thumb-active-background-color': string;
        'global-scrollbar-thumb-background-color': string;
        'global-scrollbar-thumb-border-radius': string;
        'global-scrollbar-thumb-hover-background-color': string;
        'global-scrollbar-track-background-color': string;
        'global-scrollbar-track-border-radius': string;
        'global-scrollbar-track-hover-background-color': string;
    };
    mantineOverride: {
        /**
         * The colors of the theme.
         */
        colors: {
            dark?: MantineColorsTuple;
            primary: MantineColorsTuple;
            secondary: MantineColorsTuple;
        };

        /**
         * The black color of the theme.
         */
        defaultRadius?: MantineThemeOverride['defaultRadius'];

        /**
         * The focus ring of the theme.
         */
        focusRing?: MantineThemeOverride['focusRing'];

        /**
         * The font family of the theme.
         */
        fontFamily?: MantineThemeOverride['fontFamily'];

        /**
         * The font family of the theme for monospaced text.
         */
        fontFamilyMonospace?: MantineThemeOverride['fontFamilyMonospace'];

        /**
         * The font sizes of the theme.
         */
        fontSize?: MantineThemeOverride['fontSizes'];

        /**
         * The line heights of the theme.
         */
        lineHeights?: MantineThemeOverride['lineHeights'];

        /**
         * The primary shade of the theme for dark/light modes.
         */
        primaryShade?: MantineThemeOverride['primaryShade'];

        /**
         * The radius of the theme.
         */
        radius?: MantineThemeOverride['radius'];

        /**
         * The shadows of the theme.
         */
        shadows?: MantineThemeOverride['shadows'];

        /**
         * The spacing of the theme.
         */
        spacing?: MantineThemeOverride['spacing'];

        /**
         * The white color of the theme.
         */
        white?: MantineThemeOverride['white'];
    };
}
