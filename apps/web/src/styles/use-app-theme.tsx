import type { AppTheme } from '/@/styles/theme-types';
import type { MantineThemeOverride } from '@mantine/core';
import { useEffect, useMemo } from 'react';
import { createAppTheme } from '/@/styles/mantine-theme';
import { themes } from '/@/styles/themes';
import { caseConverter } from '/@/utils/case-converter';

const cssVariableProperties: Partial<keyof AppTheme>[] = [
    'backgroundLight',
    'backgroundDark',
    'textLight',
    'textDark',
];

export function useAppTheme(): MantineThemeOverride {
    // TODO: Get theme from settings
    const themeName = 'default';
    const selectedTheme = themes[themeName as keyof typeof themes];

    const theme = createAppTheme(selectedTheme);

    const themeVars = useMemo(() => {
        return Object.entries(selectedTheme).map(([key, value]) => {
            if (cssVariableProperties.includes(key as Partial<keyof AppTheme>)) {
                return [`--theme-${caseConverter.camelToHyphen(key)}`, value];
            }

            return undefined;
        }).filter(Boolean) as [string, string][];
    }, [selectedTheme]);

    useEffect(() => {
        document.documentElement.setAttribute('data-app-theme', themeName);

        if (themeVars.length > 0) {
            let styleElement = document.getElementById('theme-variables');
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'theme-variables';
                document.head.appendChild(styleElement);
            }

            let cssText = ':root {\n';

            for (const [key, value] of themeVars) {
                cssText += `  ${key}: ${value};\n`;
            }

            cssText += '}';

            styleElement.textContent = cssText;
        }
    }, [selectedTheme, themeVars]);

    return theme;
}
