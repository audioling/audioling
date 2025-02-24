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
    filter: src => !src.endsWith('.map') && !src.endsWith('.d.ts'),
    recursive: true,
};

cpSync(path.join(workDir, '../web/dist'), path.join(workDir, './dist/web'), copySyncOptions);
cpSync(path.join(workDir, '../preload/dist'), path.join(workDir, './dist/preload'), copySyncOptions);

const options: Configuration = {
    appId,
    // eslint-disable-next-line no-template-curly-in-string
    artifactName: '${productName}_${arch}_${version}.${ext}',
    asar: true,
    buildDependenciesFromSource: false,

    // "store” | “normal” | "maximum". - For testing builds, use 'store' to reduce build time significantly.
    compression: 'normal',
    copyright: appName,
    directories: {
        buildResources: 'build-resources',
        output: '../../out',
    },

    dmg: {
        sign: true,
    },
    extraMetadata: {
        main: 'dist/main.cjs',
        name: appName,
        version,
    },
    files: [
        'dist',
        'resources',
    ],

    linux: {
        desktop: {
            Encoding: 'UTF-8',
            MimeType: 'x-scheme-handler/deeplink',
            StartupNotify: 'false',
        },
        target: ['AppImage', 'rpm', 'deb'],
    },
    mac: {
        entitlements: 'build-resources/entitlements.mac.plist',
        entitlementsInherit: 'build-resources/entitlements.mac.plist',
        gatekeeperAssess: false,
        hardenedRuntime: true,
        icon: 'icon.icns',
        // identity: "",
        notarize: false,
        target: [
            {
                arch: ['x64', 'arm64'],
                target: 'default',
            },
        ],
    },

    // afterSign: async (context) => {
    //   await notarizeMac(context)
    // },
    nodeGypRebuild: false,
    nsis: {
        allowToChangeInstallationDirectory: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        oneClick: false,
        perMachine: true,
        shortcutName,
    },
    productName: appName,
    protocols: {
        name: 'ElectronApp Example',
        schemes: ['electronapp'],
    },
    publish: [
        {
            provider: 'github',
            releaseType: 'draft',
            // private: true,
        },
    ],
    removePackageScripts: true,

    win: {
        icon: 'icon.ico',
        target: [
            {
                arch: ['ia32', 'x64'],
                target: 'nsis',
            },
        ],
    },
};

const targetPlatform: Platform = {
    darwin: Platform.MAC,
    linux: Platform.LINUX,
    win32: Platform.WINDOWS,
}[platform];

build({
    config: options,
    publish: process.env.CI ? 'always' : 'never',
    targets: targetPlatform.createTarget(),
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
