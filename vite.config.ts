import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import url from 'node:url';

import {defineConfig} from 'vite';

// Vite Plugins
import preactPreset from '@preact/preset-vite';
import webExtension from 'vite-plugin-web-extension';

import createManifest from './source/manifest.js';

const targetBrowser = process.env.VITE_BROWSER ?? 'firefox';
process.env.VITE_BROWSER = targetBrowser;

const currentDir = path.dirname(url.fileURLToPath(import.meta.url));
const buildDir = path.join(currentDir, 'build', targetBrowser);
const sourceDir = path.join(currentDir, 'source');

// Create the browser profile if it doesn't already exist.
fs.mkdirSync(path.join(currentDir, targetBrowser), {recursive: true});

const webExtConfig: Record<string, unknown> = {
  browserConsole: true,
  chromiumProfile: 'chromium/',
  firefoxProfile: 'firefox/',
  keepProfileChanges: true,
};

if (targetBrowser === 'chromium') {
  webExtConfig.startUrl = 'chrome://extensions/';
  webExtConfig.target = 'chromium';
} else {
  webExtConfig.startUrl = 'about:debugging#/runtime/this-firefox';
  webExtConfig.target = 'firefox-desktop';
}

export default defineConfig({
  build: {
    outDir: buildDir,
    minify: false,
    sourcemap: 'inline',
  },
  plugins: [
    preactPreset(),
    // See vite-plugin-web-extension for documentation.
    // https://github.com/aklinker1/vite-plugin-web-extension
    webExtension({
      assets: 'assets',
      browser: targetBrowser,
      manifest: () => createManifest(targetBrowser),
      webExtConfig,
    }),
  ],
  root: sourceDir,
});
