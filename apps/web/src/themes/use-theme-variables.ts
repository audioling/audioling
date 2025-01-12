import { useEffect } from 'react';
import { themes } from '@/themes/index.ts';

export function useThemeVariables(theme: string) {
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);

        if (theme) {
            let styleElement = document.getElementById('theme-variables');
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'theme-variables';
                document.head.appendChild(styleElement);
            }

            let cssText = ':root {\n';

            for (const [key, value] of Object.entries(themes[theme as keyof typeof themes].theme)) {
                cssText += `  --${key}: ${value};\n`;
            }

            for (const [key, value] of Object.entries(
                themes[theme as keyof typeof themes].components,
            )) {
                for (const [subKey, subValue] of Object.entries(value)) {
                    cssText += `  --${key}-${subKey}: ${subValue};\n`;
                }
            }

            cssText += '}';

            styleElement.textContent = cssText;
        }
    }, [theme]);
}
