import {PrivacyLink} from '@holllo/gram';
import {html} from 'htm/preact';
import {Component} from 'preact';
import browser from 'webextension-polyfill';

type Props = {
  manifest: browser.Manifest.ManifestBase;
};

export class PageFooter extends Component<Props> {
  render() {
    const {manifest} = this.props;
    const version = manifest.version;

    const donateLinkAttributes = {
      href: 'https://github.com/sponsors/Bauke',
    };
    const donateLink = html`
      <${PrivacyLink} attributes=${donateLinkAttributes}>Donate<//>
    `;

    const versionLinkAttributes = {
      href: `https://github.com/Holllo/fangs/releases/tag/${version}`,
    };
    const versionLink = html`
      <${PrivacyLink} attributes=${versionLinkAttributes}>v${version}<//>
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
