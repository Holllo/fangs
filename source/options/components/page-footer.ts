import {html} from 'htm/preact';
import {Component} from 'preact';
import browser from 'webextension-polyfill';

import {Link} from './link.js';

type Props = {
  manifest: browser.Manifest.ManifestBase;
};

export class PageFooter extends Component<Props> {
  render() {
    const {manifest} = this.props;
    const version = manifest.version;

    const donateLink = html`
      <${Link} text="Donate" url="https://github.com/sponsors/Bauke" />
    `;

    const versionLink = html`
      <${Link}
        text="v${version}"
        url="https://github.com/Holllo/fangs/releases/tag/${version}"
      />
    `;

    return html`
      <footer class="page-footer">
        <p>
          ${donateLink} 💖 ${versionLink} © Holllo — Free and open-source,
          forever.
        </p>
      </footer>
    `;
  }
}
