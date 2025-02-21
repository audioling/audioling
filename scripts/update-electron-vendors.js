/**
 * 这个脚本要在 electron 上下文中运行
 * @example
 *  ELECTRON_RUN_AS_NODE=1 electron scripts/update-electron-vendors.js
 */

const { writeFileSync } = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const electronRelease = process.versions;

const node = electronRelease.node.split('.')[0];
const chrome = electronRelease.v8.split('.').splice(0, 2).join('');

const browserslistrcPath = path.resolve(process.cwd(), '../web', '.browserslistrc');

writeFileSync('./.electron-vendors.cache.json', JSON.stringify({ chrome, node }, null, 2));
writeFileSync(browserslistrcPath, `Chrome ${chrome}`, 'utf8');
