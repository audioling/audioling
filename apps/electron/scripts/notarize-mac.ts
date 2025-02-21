import type { AfterPackContext } from 'electron-builder';
import { notarize } from '@electron/notarize';

/**
 * https://github.com/electron/notarize
 *
 * Verify that the signature is successful: codesign -dv --verbose=4 /path/to/your/file.dmg
 */
export async function notarizeMac(context: AfterPackContext) {
    const { electronPlatformName, appOutDir } = context;
    // Mac releases require hardening+notarization: https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution
    if (electronPlatformName !== 'darwin') {
        return;
    }

    const appName = context.packager.appInfo.productFilename;

    return await notarize({
        appPath: `${appOutDir}/${appName}.app`,
        tool: 'notarytool',
        appleId: process.env.APPLE_ID!, //  Apple Developer Account
        appleIdPassword: process.env.APPLE_PASSWORD!, // Apple Developer Password
        teamId: process.env.APPLE_TEAM_ID!, // Developer Team ID
    });
}
