import type { Configuration } from 'electron-builder';
import type { CopySyncOptions } from 'node:fs';
import { cpSync } from 'node:fs';
import path from 'node:path';
import process, { exit, platform } from 'node:process';
import { build, Platform } from 'electron-builder';

const version = process.env.VITE_APP_VERSION;
const isDev = process.env.NODE_ENV === 'development';
const appName = isDev ? 'audioling-dev' : 'audioling';
const appId = isDev ? 'com.audioling-dev.app' : 'com.audioling.app';
const shortcutName = isDev ? 'audioling dev' : 'audioling';

console.log('APP Environment:', isDev, appName);
console.log('APP Version：', version);

const workDir = path.join(__dirname, '../');

const copySyncOptions: CopySyncOptions = {
    recursive: true,
    filter: src => !src.endsWith('.map') && !src.endsWith('.d.ts'),
};

cpSync(path.join(workDir, '../web/dist'), path.join(workDir, './dist/web'), copySyncOptions);
cpSync(path.join(workDir, '../preload/dist'), path.join(workDir, './dist/preload'), copySyncOptions);

const options: Configuration = {
    appId,
    productName: appName,
    copyright: appName,
    // eslint-disable-next-line no-template-curly-in-string
    artifactName: '${productName}_${arch}_${version}.${ext}',
    asar: true,
    extraMetadata: {
        version,
        name: appName,
        main: 'dist/main.cjs',
    },
    directories: {
        output: '../../out',
        buildResources: 'build-resources',
    },
    files: [
        'dist',
        'resources',
    ],
    protocols: {
        name: 'ElectronApp Example',
        schemes: ['electronapp'],
    },

    // "store” | “normal” | "maximum". - For testing builds, use 'store' to reduce build time significantly.
    compression: 'normal',
    removePackageScripts: true,

    // afterSign: async (context) => {
    //   await notarizeMac(context)
    // },
    nodeGypRebuild: false,
    buildDependenciesFromSource: false,

    win: {
        icon: 'icon.ico',
        target: [
            {
                target: 'nsis',
                arch: ['ia32', 'x64'],
            },
        ],
    },
    nsis: {
        oneClick: false,
        perMachine: true,
        allowToChangeInstallationDirectory: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName,
    },

    dmg: {
        sign: true,
    },
    mac: {
        target: [
            {
                target: 'default',
                arch: ['x64', 'arm64'],
            },
        ],
        icon: 'icon.icns',
        hardenedRuntime: true,
        gatekeeperAssess: false,
        entitlements: 'build-resources/entitlements.mac.plist',
        entitlementsInherit: 'build-resources/entitlements.mac.plist',
        // identity: "",
        notarize: false,
    },

    linux: {
        desktop: {
            StartupNotify: 'false',
            Encoding: 'UTF-8',
            MimeType: 'x-scheme-handler/deeplink',
        },
        target: ['AppImage', 'rpm', 'deb'],
    },
    publish: [
        {
            provider: 'github',
            releaseType: 'draft',
            // private: true,
        },
    ],
};

const targetPlatform: Platform = {
    darwin: Platform.MAC,
    win32: Platform.WINDOWS,
    linux: Platform.LINUX,
}[platform];

build({
    targets: targetPlatform.createTarget(),
    config: options,
    publish: process.env.CI ? 'always' : 'never',
})
    .then((result) => {
        console.log(JSON.stringify(result));
        const outDir = path.join(workDir, options.directories!.output!);
        console.log('\x1B[32m', `打包完成🎉🎉🎉你要的都在 ${outDir} 目录里🤪🤪🤪`);
    })
    .catch((error) => {
        console.log('\x1B[31m', '打包失败，错误信息：', error);
        exit(1);
    });
