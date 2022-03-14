import {html} from 'htm/preact';
import {Component, render} from 'preact';
import browser from 'webextension-polyfill';

import {PageFooter} from './components/page-footer.js';
import {PageHeader} from './components/page-header.js';
import {PageMain} from './components/page-main.js';

window.addEventListener('DOMContentLoaded', () => {
  console.debug('Options page opened!');

  const manifest = browser.runtime.getManifest();

  render(html`<${OptionsPage} manifest=${manifest} />`, document.body);
});

type Props = {
  manifest: browser.Manifest.ManifestBase;
};

class OptionsPage extends Component<Props> {
  render() {
    const {manifest} = this.props;

    return html`
      <${PageHeader} />
      <${PageMain} />
      <${PageFooter} manifest=${manifest} />
    `;
  }
}
