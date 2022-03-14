import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import {defineConfig} from 'vite';

// Vite Plugins
import preactPreset from '@preact/preset-vite';
import webExtension from 'vite-plugin-web-extension';

const currentDir = path.dirname(url.fileURLToPath(import.meta.url));

const buildDir = path.join(currentDir, 'build');
const sourceDir = path.join(currentDir, 'source');

// Create the Firefox profile if it doesn't already exist.
fs.mkdirSync(path.join(currentDir, 'firefox'), {recursive: true});

export default defineConfig({
  build: {
    outDir: buildDir,
    sourcemap: 'inline',
  },
  plugins: [
    preactPreset(),
    // See vite-plugin-web-extension for documentation.
    // https://github.com/aklinker1/vite-plugin-web-extension
    webExtension({
      assets: 'assets',
      browser: 'firefox',
      manifest: path.join(sourceDir, 'manifest.json'),
      webExtConfig: {
        browserConsole: true,
        firefoxProfile: 'firefox/',
        keepProfileChanges: true,
        startUrl: 'about:debugging#/runtime/this-firefox',
        target: 'firefox-desktop',
      },
    }),
  ],
  root: sourceDir,
});
