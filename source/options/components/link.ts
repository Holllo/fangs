import {html} from 'htm/preact';
import {Component} from 'preact';

type Props = {
  cssClass: string;
  text: string;
  url: string;
};

export class Link extends Component<Props> {
  render() {
    const {cssClass, text, url} = this.props;

    return html`
      <a class=${cssClass} href=${url} target="_blank" rel="noopener">
        ${text}
      </a>
    `;
  }
}
